import { useEffect, useState } from "react";
import { useFormik } from "formik";

import * as Yup from "yup";
import "./AddNewNotification.scss";
import { useNavigate } from "react-router-dom";

import { convertToRaw, EditorState, Modifier } from "draft-js";
import draftToHtml from "draftjs-to-html";

import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { CharacterValidationReg } from "../../constants";
import Checkbox from "../Checkbox";
import SelectWrapper from "../SelectWrapper";
import ActionButtons from "../Button/ActionButtons";
import Button from "../Button/Button";

const toolbar = {
  options: ["inline", "textAlign", "colorPicker"],
  inline: {
    inDropdown: false,
    options: ["bold", "italic", "underline", "strikethrough"],
  },
};

const validateCondition = (...args: unknown[]) => args.every((i) => Boolean(i));

interface NotificationAdd {
  notificationScenarioId: string;
  smsBody: string;
  emailSubject: string;
  emailBody: string;
  emailButtonName: string;
  smsRequired: boolean;
  emailRequired: boolean;
  physicianDefault: boolean;
  salesRepDefault: boolean;
  coordinatorDefault: boolean;
  inPortalWebRequired: boolean;
  inPortalWebSubject: string;
  inPortalWebLinkName: string;
  inPortalWebBody: string;
  mobilePushRequired: boolean;
  mobilePushSubject: string;
  mobilePushBody: string;
  isActive: boolean;
}

const AddNewNotification = () => {
  const navigate = useNavigate();

  const [staticVaribles, setStaticVaribles] = useState([]);
  const [notificationScenario, setNotificationScenario] = useState([]);
  const [smsCheckbox, setSmsCheckbox] = useState(true);
  const [isActive, setIsActive] = useState(true);
  const [emailNotificationCheckbox, setEmailNotificationCheckbox] =
    useState(true);
  const [caretPostionEmail, setCaretPostionEmail] = useState<any>(-1);
  const [caretPostionNotify, setCaretPostionNotify] = useState<any>(-1);

  const initialState = () => EditorState.createEmpty();
  const initalStateEmail = () => EditorState.createEmpty();
  const [editorState, setEditorState] = useState(initialState);
  const [editorStateEmail, setEditorStateEmail] = useState(initalStateEmail);

  const [errorState, setErrorState] = useState<any>(null);
  const [cur, setCur] = useState<any>("");
  const [fieldType, setFieldType] = useState<any>("");

  const formik = useFormik({
    initialValues: {
      notificationScenarioId: "",
      smsBody: "",
      emailSubject: "",
      emailBody: "",
      emailButtonName: "",
      smsRequired: true,
      emailRequired: true,
      physicianDefault: true,
      salesRepDefault: true,
      coordinatorDefault: true,
      inPortalWebRequired: true,
      inPortalWebSubject: "",
      inPortalWebBody: "",
      mobilePushRequired: true,
      mobilePushSubject: "",
      mobilePushBody: "",
      inPortalWebLinkName: "",
      isActive: true,
    },
    onSubmit: (values) => {
      const resetForm = formik.resetForm;
      handleNotificationSubmit(values, { resetForm });
    },

    validationSchema: Yup.object().shape({
      smsRequired: Yup.boolean(),
      smsBody: Yup.string().max(100, "Max 100 Characters only"),
    }),
  });
  const { setFieldValue, values, setFieldTouched, setFieldError } = formik;

  const handleSelectChange = (selectedOption: any) => {
    setFieldValue("notificationScenarioId", selectedOption.value);
    if (selectedOption.value.length < 1) {
      setFieldTouched("notificationScenarioId", true);
    }
  };

  const handleCheckboxChange = (type: any) => {
    if (type == "sms") {
      setSmsCheckbox(!smsCheckbox);
      setFieldValue("smsRequired", !smsCheckbox);
    } else if (type == "email") {
      setEmailNotificationCheckbox(!emailNotificationCheckbox);
      setFieldValue("emailRequired", !emailNotificationCheckbox);
    } else if (type == "inPortalWebRequired") {
      setFieldValue("inPortalWebRequired", !values?.inPortalWebRequired);
    } else if (type == "isActive") {
      setIsActive(!isActive);
      setFieldValue("isActive", !isActive);
    } else if (type == "coordinatorDefault") {
      setFieldValue("coordinatorDefault", !values.coordinatorDefault);
    } else if (type == "physicianDefault") {
      setFieldValue("physicianDefault", !values.physicianDefault);
    } else if (type == "salesRepDefault") {
      setFieldValue("salesRepDefault", !values.salesRepDefault);
    } else if (type == "mobilePushRequired") {
      setFieldValue("mobilePushRequired", !values.mobilePushRequired);
    }
  };

  const buttonNameValidation = () => {
    if (values?.emailBody) {
      const link = values?.emailBody?.includes("##LINK##");
      const emailname = values?.emailButtonName?.length > 1;

      if (link && !emailname) {
        setFieldError("emailButtonName", "Link Button Name  is required");
      }
    }
  };

  const checkErrors = () => {
    let shouldSubmit = true;
    if (validateCondition(values.smsRequired, !values.smsBody)) {
      shouldSubmit = false;
      setFieldError("smsBody", "Message is Required");
    }
    if (validateCondition(values.emailRequired, !values.emailBody)) {
      shouldSubmit = false;
      setFieldError("emailBody", "Message is Required");
    }
    if (validateCondition(values.emailRequired, !values.emailSubject)) {
      shouldSubmit = false;
      setFieldError("emailSubject", "Subject is required");
    }
    if (
      validateCondition(values.inPortalWebRequired, !values.inPortalWebBody)
    ) {
      shouldSubmit = false;
      setFieldError("inPortalWebBody", "Message is Required");
    }
    if (
      validateCondition(values.inPortalWebRequired, !values.inPortalWebSubject)
    ) {
      shouldSubmit = false;
      setFieldError("inPortalWebSubject", "Subject is Required");
    }
    if (
      validateCondition(values.mobilePushRequired, !values.mobilePushSubject)
    ) {
      shouldSubmit = false;
      setFieldError("mobilePushSubject", "Subject is Required");
    }
    if (validateCondition(values?.mobilePushRequired, !values.mobilePushBody)) {
      shouldSubmit = false;
      setFieldError("mobilePushBody", "Message is Required");
    }
    if (values.inPortalWebBody.includes("##LINK##")) {
      if (!values.inPortalWebLinkName) {
        shouldSubmit = false;
        setFieldError("inPortalWebLinkName", "In-Portal Link Name required");
      } else if (values.inPortalWebLinkName.length > 50) {
        shouldSubmit = false;
        setFieldError(
          "inPortalWebLinkName",
          "In-Portal Link Name cannot be more than 50 characters"
        );
      } else if (!CharacterValidationReg.test(values.inPortalWebLinkName)) {
        shouldSubmit = false;
        setFieldError(
          "inPortalWebLinkName",
          "In-Portal Link Name can only include letters, spaces, hyphens, dots and numbers"
        );
      }
    }

    if (!values.notificationScenarioId) {
      setFieldError(
        "notificationScenarioId",
        "Please select a Notification Scenario"
      );
    }
    buttonNameValidation();

    return shouldSubmit;
  };

  const handleNotificationSubmit = async (
    values: NotificationAdd,
    { resetForm }: any
  ) => {
    const shouldSubmit = checkErrors();
    if (!shouldSubmit) return;

    const check =
      !values.emailRequired &&
      !values.smsRequired &&
      !values.inPortalWebRequired;

    if (check) {
      setErrorState("Select atleast one type of notification");
    } else {
      setErrorState("");
    }

    try {
      const body = formik.values;
      // Replace with actual API call
      console.log("Submitting notification:", body);

      // Simulate successful submission
      const res = { isSuccess: true };

      if (res?.isSuccess) {
        resetForm();
        navigate("/admin/notifications");
        // Replace toast with console.log or custom notification
        console.log("Data saved successfully");
      }
    } catch (error: any) {
      console.log(error);
    }
  };

  const onEditorInPortalStateChange = async (editorState: any) => {
    const selectionState = editorState.getSelection();

    setFieldType("inPortalWebBody");
    setEditorState(editorState);
    setCaretPostionNotify(selectionState?.anchorOffset);
    setCaretPostionEmail(-1);

    const rawContentState = convertToRaw(editorState.getCurrentContent());
    const pushMessage = draftToHtml(rawContentState);
    const text = editorState.getCurrentContent().getPlainText("\u0001");
    formik.setFieldValue("inPortalWebBody", pushMessage);
    if (text?.length < 1) {
      setFieldTouched("inPortalWebBody", true);
      setFieldValue("inPortalWebBody", "");
    }
  };

  const onEditorStateChangeEmail = async (editorState: any) => {
    setEditorStateEmail(editorState);
    setFieldType("emailBody");

    const selectionState = editorState.getSelection();
    setCaretPostionEmail(selectionState.anchorOffset);
    setCaretPostionNotify(-1);

    const rawContentState = convertToRaw(editorState.getCurrentContent());

    const emailBodyContent = draftToHtml(rawContentState);
    const text = editorState.getCurrentContent().getPlainText("\u0001");

    formik.setFieldValue("emailBody", emailBodyContent);
    if (text?.length < 1) {
      setFieldTouched("emailBody", true);
      setFieldValue("emailBody", "");
    } else if (values?.emailBody) {
      buttonNameValidation();
    }
  };

  const sendTextToEditor = (text: any) => {
    if (fieldType == "smsBody") {
      setFieldValue(
        "smsBody",
        values.smsBody.slice(0, cur) + text + values.smsBody.slice(cur)
      );
    } else if (fieldType == "emailSubject") {
      setFieldValue(
        "emailSubject",
        values.emailSubject.slice(0, cur) +
          text +
          values.emailSubject.slice(cur)
      );
    } else if (fieldType == "inPortalWebSubject") {
      setFieldValue(
        "inPortalWebSubject",
        values.inPortalWebSubject.slice(0, cur) +
          text +
          values.inPortalWebSubject.slice(cur)
      );
    } else if (fieldType == "mobilePushSubject") {
      setFieldValue(
        "mobilePushSubject",
        values.mobilePushSubject.slice(0, cur) +
          text +
          values.mobilePushSubject.slice(cur)
      );
    } else if (caretPostionEmail >= 0 && fieldType == "emailBody") {
      setEditorStateEmail(insertText(text, editorStateEmail));
    } else if (caretPostionNotify >= 0 && fieldType == "inPortalWebBody") {
      setEditorState(insertText(text, editorState));
    } else if (fieldType == "mobilePushBody") {
      setFieldValue(
        "mobilePushBody",
        values.mobilePushBody.slice(0, cur) +
          text +
          values.mobilePushBody.slice(cur)
      );
    }
  };

  const insertText = (text: any, editorValue: any) => {
    const currentContent = editorValue.getCurrentContent();
    const currentSelection = editorValue.getSelection();

    const newContent = Modifier.replaceText(
      currentContent,
      currentSelection,
      text
    );

    const newEditorState = EditorState.push(
      editorValue,
      newContent,
      "insert-characters"
    );
    return EditorState.forceSelection(
      newEditorState,
      newContent.getSelectionAfter()
    );
  };

  const onBlur = (e: any) => {
    checkErrors();
    setCur(e.target.selectionStart);
  };

  const handleCancel = () => {
    navigate("/admin/notifications");
  };

  return (
    <div className="container">
      <form onSubmit={formik.handleSubmit}>
        <ActionButtons>
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button type="submit">Save</Button>
        </ActionButtons>

        <div className="formWrapper1 bodyContainer">
          {errorState && (
            <div className="errorstate">
              <p>* {errorState}</p>
            </div>
          )}

          <div className="grid-container-notification">
            <div className="grid-item formDiv form-holder">
              <div className="form-group">
                <div className="displayError">
                  {validateCondition(
                    formik.touched.notificationScenarioId,
                    formik.errors.notificationScenarioId
                  ) ? (
                    <p
                      className="fieldError active"
                      style={{ marginTop: "5px" }}
                    >
                      {formik.errors.notificationScenarioId}
                    </p>
                  ) : (
                    <p className="fieldError"></p>
                  )}
                </div>
                <SelectWrapper
                  name="notificationScenarioId"
                  options={notificationScenario}
                  onChange={handleSelectChange}
                  placeholder="Notification Scenario"
                />
              </div>

              <hr className="solid" />

              <div
                className="form-group form-margin"
                style={{ marginTop: "4vh" }}
              >
                <Checkbox
                  labelPosition="left"
                  label="SMS (Message)"
                  size="sm"
                  checked={smsCheckbox}
                  onChange={() => handleCheckboxChange("sms")}
                />
                <div className="inputNameWrapper">
                  {validateCondition(
                    formik.touched.smsBody,
                    formik.errors.smsBody
                  ) ? (
                    <p className="fieldError active">{formik.errors.smsBody}</p>
                  ) : (
                    <p className="fieldError"></p>
                  )}
                </div>
                <textarea
                  rows={4}
                  cols={50}
                  id="Javascript_example"
                  name="smsBody"
                  className="nameInput textarea"
                  placeholder="Message"
                  value={formik.values.smsBody}
                  onChange={(e) => {
                    setCur(e.target.selectionStart);
                    formik.handleChange(e);
                  }}
                  onBlur={(e) => {
                    setFieldType("smsBody");
                    onBlur(e);
                  }}
                />
              </div>
              <hr className="solid" />

              <div className="form-group" style={{ marginTop: "4vh" }}>
                <Checkbox
                  labelPosition="left"
                  label="Email Notification"
                  size="sm"
                  checked={emailNotificationCheckbox}
                  onChange={() => handleCheckboxChange("email")}
                />
                <div className="inputNameWrapper">
                  {validateCondition(
                    formik.touched.emailSubject,
                    formik.errors.emailSubject
                  ) ? (
                    <p className="fieldError active">
                      {formik.errors.emailSubject}
                    </p>
                  ) : (
                    <p className="fieldError"></p>
                  )}
                </div>
                <input
                  type="text"
                  name="emailSubject"
                  className="nameInput"
                  placeholder="Subject"
                  value={formik.values.emailSubject}
                  onChange={(e) => {
                    setCur(e.target.selectionStart);
                    formik.handleChange(e);
                  }}
                  onBlur={(e) => {
                    setFieldType("emailSubject");
                    onBlur(e);
                  }}
                />
              </div>

              <div className="form-group ">
                <div className="displayError">
                  {validateCondition(
                    formik.touched.emailBody,
                    formik.errors.emailBody
                  ) ? (
                    <p
                      className="fieldError active"
                      style={{ marginTop: "5px" }}
                    >
                      {formik.errors.emailBody}
                    </p>
                  ) : (
                    <p className="fieldError"></p>
                  )}
                </div>
                <div>
                  <Editor
                    editorState={editorStateEmail}
                    toolbarClassName="toolbarClassName"
                    wrapperClassName="wrapperClassName"
                    editorClassName="editorClassName"
                    onEditorStateChange={(value) =>
                      onEditorStateChangeEmail(value)
                    }
                    placeholder="Email Message"
                    editorStyle={{
                      minHeight: "150px",
                      padding: "10px",
                      fontSize: "14px",
                    }}
                    toolbar={toolbar}
                    onBlur={(e: any) => onBlur(e)}
                  />
                </div>
              </div>

              <div className="form-group" style={{ marginTop: "4vh" }}>
                <label htmlFor="emailButtonName">Link Button Name</label>{" "}
                <div className="displayError">
                  {validateCondition(
                    formik.touched.emailButtonName,
                    formik.errors.emailButtonName
                  ) ? (
                    <p className="fieldError active">
                      {formik.errors.emailButtonName}
                    </p>
                  ) : (
                    <p className="fieldError"></p>
                  )}
                </div>
                <div>
                  <input
                    type="text"
                    name="emailButtonName"
                    className="nameInput"
                    placeholder=""
                    value={values?.emailButtonName}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                </div>
              </div>

              <hr className="solid" />

              <div
                className="form-group form-margin"
                style={{ marginTop: "4vh" }}
              >
                <Checkbox
                  label="In-Portal Notifications"
                  size="sm"
                  labelPosition="left"
                  checked={values.inPortalWebRequired}
                  onChange={() => handleCheckboxChange("inPortalWebRequired")}
                />
                <div className="inputNameWrapper">
                  {validateCondition(
                    formik.touched.inPortalWebSubject,
                    formik.errors.inPortalWebSubject
                  ) ? (
                    <p className="fieldError active">
                      {formik.errors.inPortalWebSubject}
                    </p>
                  ) : (
                    <p className="fieldError"></p>
                  )}
                </div>
                <input
                  type="text"
                  name="inPortalWebSubject"
                  className="nameInput"
                  placeholder="Subject"
                  value={values.inPortalWebSubject}
                  onChange={(e) => {
                    setCur(e.target.selectionStart);
                    formik.handleChange(e);
                  }}
                  onBlur={(e) => {
                    formik.handleBlur(e);
                    setFieldType("inPortalWebSubject");
                    onBlur(e);
                  }}
                />
              </div>

              <div className="form-group ">
                <div className="displayError">
                  {validateCondition(
                    formik.touched.inPortalWebBody,
                    formik.errors.inPortalWebBody
                  ) ? (
                    <p className="fieldError active">
                      {formik.errors.inPortalWebBody}
                    </p>
                  ) : (
                    <p className="fieldError"></p>
                  )}
                </div>
                <div>
                  <Editor
                    editorState={editorState}
                    toolbarClassName="toolbarClassName"
                    wrapperClassName="wrapperClassName"
                    editorClassName="editorClassName"
                    onEditorStateChange={(value) =>
                      onEditorInPortalStateChange(value)
                    }
                    editorStyle={{
                      minHeight: "150px",
                      padding: "10px",
                      fontSize: "14px",
                    }}
                    placeholder="In-Portal Message"
                    toolbar={toolbar}
                    onBlur={(e: any) => onBlur(e)}
                  />
                </div>
              </div>

              <div className="form-group" style={{ marginTop: "4vh" }}>
                <label htmlFor="inPortalWebLinkName">In-Portal Link Name</label>{" "}
                <div className="displayError">
                  {validateCondition(
                    formik.touched.inPortalWebLinkName,
                    formik.errors.inPortalWebLinkName
                  ) ? (
                    <p className="fieldError active">
                      {formik.errors.inPortalWebLinkName}
                    </p>
                  ) : (
                    <p className="fieldError"></p>
                  )}
                </div>
                <div>
                  <input
                    type="text"
                    name="inPortalWebLinkName"
                    className="nameInput"
                    placeholder=""
                    value={values?.inPortalWebLinkName}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                </div>
              </div>

              <hr className="solid" />

              {/* sms web app */}
              <div
                className="form-group form-margin"
                style={{ marginTop: "4vh" }}
              >
                <Checkbox
                  label="Mobile App Push Notifications"
                  labelPosition="left"
                  size="sm"
                  checked={values.mobilePushRequired}
                  onChange={() => handleCheckboxChange("mobilePushRequired")}
                />
                <div className="inputNameWrapper">
                  <div className="displayError">
                    {validateCondition(
                      formik.touched.mobilePushSubject,
                      formik.errors.mobilePushSubject
                    ) ? (
                      <p className="fieldError active">
                        {formik.errors.mobilePushSubject}
                      </p>
                    ) : (
                      <p className="fieldError"></p>
                    )}
                  </div>
                </div>
                <input
                  type="text"
                  name="mobilePushSubject"
                  className="nameInput"
                  placeholder="Subject"
                  value={values.mobilePushSubject}
                  onChange={(e) => {
                    setCur(e.target.selectionStart);
                    formik.handleChange(e);
                  }}
                  onBlur={(e) => {
                    formik.handleBlur(e);
                    setFieldType("mobilePushSubject");
                    onBlur(e);
                  }}
                />
              </div>

              <div className="form-group">
                <div className="displayError">
                  {validateCondition(
                    formik.touched.mobilePushBody,
                    formik.errors.mobilePushBody
                  ) ? (
                    <p className="fieldError active">
                      {formik.errors.mobilePushBody}
                    </p>
                  ) : (
                    <p className="fieldError"></p>
                  )}
                </div>
                <div>
                  <textarea
                    rows={4}
                    cols={50}
                    id="Javascript_example"
                    name="mobilePushBody"
                    className="nameInput textarea"
                    placeholder="Mobile App Message"
                    value={formik.values.mobilePushBody}
                    onChange={(e) => {
                      setCur(e.target.selectionStart);
                      if (fieldType !== "mobilePushBody") {
                        setFieldType("mobilePushBody");
                      }
                      formik.handleChange(e);
                    }}
                    onBlur={(e) => {
                      setFieldType("mobilePushBody");
                      onBlur(e);
                    }}
                  />
                </div>
              </div>
            </div>

            <div className="grid-item formDiv variables-container">
              <div className="is-active-container">
                <div className="form-group form-margin">
                  <Checkbox
                    labelPosition="left"
                    label="Is Active"
                    checked={isActive}
                    onChange={() => handleCheckboxChange("isActive")}
                  />
                  <div className="inputNameWrapper">
                    {validateCondition(
                      formik.touched.isActive,
                      formik.errors.isActive
                    ) ? (
                      <p className="fieldError active">
                        {formik.errors.isActive}
                      </p>
                    ) : (
                      <p className="fieldError"></p>
                    )}
                  </div>
                </div>
              </div>
              <label htmlFor="static-variable">Static variables</label>
              <span>
                {staticVaribles?.length > 0 &&
                  staticVaribles?.map((d: any) => {
                    return (
                      <div className="static-layout " key={d.name}>
                        <button
                          className="borderButton static-button"
                          type="button"
                          onClick={() => sendTextToEditor(d.name)}
                        >
                          {d?.name}
                        </button>
                      </div>
                    );
                  })}
              </span>
            </div>
          </div>
        </div>
        <div className="md-is-active-container">
          <div className="form-group form-margin">
            <div className="inputNameWrapper">
              <Checkbox
                labelPosition="left"
                label="Is Active"
                checked={isActive}
                onChange={() => handleCheckboxChange("isActive")}
              />
              {validateCondition(
                formik.touched.isActive,
                formik.errors.isActive
              ) ? (
                <p className="fieldError active">{formik.errors.isActive}</p>
              ) : (
                <p className="fieldError"></p>
              )}
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddNewNotification;
