import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";

import { convertToRaw, EditorState, Modifier } from "draft-js";
import draftToHtml from "draftjs-to-html";

import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

import "./AddNewNotification.scss";

// Dummy API functions (replace with actual API imports in your project)
const getStaticVariables = async () => [
  { name: "##FIRST_NAME##" },
  { name: "##MIDDLE_NAME##" },
  { name: "##LAST_NAME##" },
  { name: "##DESIGNATION##" },
  { name: "##DATE##" },
];

// Mock API post function
const postNotification = async (data: any) => {
  console.log("Posting notification data:", data);
  return { isSuccess: true, response: { status: 200 } };
};

const CharacterValidationReg = /^[a-zA-Z0-9\s.\-]+$/;

const toolbar = {
  options: ["inline", "textAlign", "colorPicker"],
  inline: {
    inDropdown: false,
    options: ["bold", "italic", "underline", "strikethrough"],
  },
};

interface NotificationAdd {
  emailRecipients: string;
  notificationScenarioId: string;
  smsBody: string;
  emailSubject: string;
  emailBody: string;
  emailButtonName: string;
  smsRequired: boolean;
  emailRequired: boolean;
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

  const [staticVariables, setStaticVariables] = useState<{ name: string }[]>(
    []
  );
  const [smsCheckbox, setSmsCheckbox] = useState(true);
  const [emailNotificationCheckbox, setEmailNotificationCheckbox] =
    useState(true);
  const [isActive, setIsActive] = useState(true);

  const initialState = () => EditorState.createEmpty();
  const [editorState, setEditorState] = useState(initialState);
  const [editorStateEmail, setEditorStateEmail] = useState(initialState);

  const [cur, setCur] = useState<number | null>(-1);
  const [fieldType, setFieldType] = useState<string>("");

  const formik = useFormik({
    initialValues: {
      emailRecipients: "",
      notificationScenarioId: "",
      smsBody: "",
      emailSubject: "",
      emailBody: "",
      emailButtonName: "",
      smsRequired: true,
      emailRequired: true,
      inPortalWebRequired: true,
      inPortalWebSubject: "",
      inPortalWebLinkName: "",
      inPortalWebBody: "",
      mobilePushRequired: true,
      mobilePushSubject: "",
      mobilePushBody: "",
      isActive: true,
    },
    validationSchema: Yup.object().shape({
      smsRequired: Yup.boolean(),
      smsBody: Yup.string().max(100, "Max 100 Characters only"),
    }),
    onSubmit: (values, { resetForm }) => {
      handleNotificationSubmit(values, { resetForm });
    },
  });

  const { values, setFieldValue, setFieldError, setFieldTouched } = formik;

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line
  }, []);

  const fetchData = async () => {
    try {
      const staticVars = await getStaticVariables();
      setStaticVariables(staticVars);
    } catch (error) {
      console.error("Failed to fetch static variables", error);
    }
  };

  const handleCheckboxChange = (type: string) => {
    if (type === "sms") {
      setSmsCheckbox(!smsCheckbox);
      setFieldValue("smsRequired", !smsCheckbox);
    } else if (type === "email") {
      setEmailNotificationCheckbox(!emailNotificationCheckbox);
      setFieldValue("emailRequired", !emailNotificationCheckbox);
    } else if (type === "inPortalWebRequired") {
      setFieldValue("inPortalWebRequired", !values.inPortalWebRequired);
    } else if (type === "isActive") {
      setIsActive(!isActive);
      setFieldValue("isActive", !isActive);
    } else if (type === "mobilePushRequired") {
      setFieldValue("mobilePushRequired", !values.mobilePushRequired);
    }
  };

  const buttonNameValidation = () => {
    if (values.emailBody) {
      const link = values.emailBody.includes("##LINK##");
      const emailname = values.emailButtonName.length > 1;
      if (link && !emailname) {
        setFieldError("emailButtonName", "Link Button Name is required");
      }
    }
  };

  const checkErrors = () => {
    let shouldSubmit = true;

    if (values.smsRequired && !values.smsBody) {
      shouldSubmit = false;
      setFieldError("smsBody", "Message is Required");
    }
    if (values.emailRequired && !values.emailBody) {
      shouldSubmit = false;
      setFieldError("emailBody", "Message is Required");
    }
    if (values.emailRequired && !values.emailSubject) {
      shouldSubmit = false;
      setFieldError("emailSubject", "Subject is required");
    }
    if (values.inPortalWebRequired && !values.inPortalWebBody) {
      shouldSubmit = false;
      setFieldError("inPortalWebBody", "Message is Required");
    }
    if (values.inPortalWebRequired && !values.inPortalWebSubject) {
      shouldSubmit = false;
      setFieldError("inPortalWebSubject", "Subject is Required");
    }
    if (values.mobilePushRequired && !values.mobilePushSubject) {
      shouldSubmit = false;
      setFieldError("mobilePushSubject", "Subject is Required");
    }
    if (values.mobilePushRequired && !values.mobilePushBody) {
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
          "In-Portal Link Name cannot exceed 50 characters"
        );
      } else if (!CharacterValidationReg.test(values.inPortalWebLinkName)) {
        shouldSubmit = false;
        setFieldError(
          "inPortalWebLinkName",
          "Name can only include letters, spaces, hyphens, dots and numbers"
        );
      }
    }

    if (!values.notificationScenarioId) {
      setFieldError(
        "notificationScenarioId",
        "Notification Scenario is required"
      );
      setFieldTouched("notificationScenarioId", true);
      shouldSubmit = false;
    }

    buttonNameValidation();

    return shouldSubmit;
  };

  const handleNotificationSubmit = async (
    values: NotificationAdd,
    { resetForm }: { resetForm: () => void }
  ) => {
    if (!checkErrors()) return;

    if (
      !values.emailRequired &&
      !values.smsRequired &&
      !values.inPortalWebRequired
    ) {
      alert("Select at least one type of notification");
      return;
    }

    try {
      const res = await postNotification(values);
      if (res.isSuccess || res.response?.status === 200) {
        resetForm();
        navigate("/admin/notifications");
        alert("Data saved successfully");
      }
    } catch (error) {
      console.error(error);
      alert("Failed to save data");
    }
  };

  const insertText = (text: string, editorValue: EditorState) => {
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

  const sendTextToEditor = (text: string) => {
    if (fieldType === "smsBody") {
      const curPos = cur !== null && cur > -1 ? cur : values.smsBody.length;
      setFieldValue(
        "smsBody",
        values.smsBody.slice(0, curPos) + text + values.smsBody.slice(curPos)
      );
    } else if (fieldType === "emailSubject") {
      const curPos =
        cur !== null && cur > -1 ? cur : values.emailSubject.length;
      setFieldValue(
        "emailSubject",
        values.emailSubject.slice(0, curPos) +
          text +
          values.emailSubject.slice(curPos)
      );
    } else if (fieldType === "inPortalWebSubject") {
      const curPos =
        cur !== null && cur > -1 ? cur : values.inPortalWebSubject.length;
      setFieldValue(
        "inPortalWebSubject",
        values.inPortalWebSubject.slice(0, curPos) +
          text +
          values.inPortalWebSubject.slice(curPos)
      );
    } else if (fieldType === "mobilePushSubject") {
      const curPos =
        cur !== null && cur > -1 ? cur : values.mobilePushSubject.length;
      setFieldValue(
        "mobilePushSubject",
        values.mobilePushSubject.slice(0, curPos) +
          text +
          values.mobilePushSubject.slice(curPos)
      );
    } else if (fieldType === "emailBody" && editorStateEmail) {
      setEditorStateEmail(insertText(text, editorStateEmail));
    } else if (fieldType === "inPortalWebBody" && editorState) {
      setEditorState(insertText(text, editorState));
    } else if (fieldType === "mobilePushBody") {
      const curPos =
        cur !== null && cur > -1 ? cur : values.mobilePushBody.length;
      setFieldValue(
        "mobilePushBody",
        values.mobilePushBody.slice(0, curPos) +
          text +
          values.mobilePushBody.slice(curPos)
      );
    }
  };

  const onBlur = (
    e: React.FocusEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
    setCur(e.target.selectionStart);
    checkErrors();
  };

  const onEditorStateChangeEmail = (editorStateValue: EditorState) => {
    setEditorStateEmail(editorStateValue);
    setFieldType("emailBody");
    const rawContent = convertToRaw(editorStateValue.getCurrentContent());
    const html = draftToHtml(rawContent);
    const text = editorStateValue.getCurrentContent().getPlainText("\u0001");
    formik.setFieldValue("emailBody", text.length > 0 ? html : "");
    if (text.length === 0) {
      formik.setFieldTouched("emailBody", true);
    } else {
      buttonNameValidation();
    }
  };

  const onEditorInPortalStateChange = (editorStateValue: EditorState) => {
    setEditorState(editorStateValue);
    setFieldType("inPortalWebBody");
    const rawContent = convertToRaw(editorStateValue.getCurrentContent());
    const html = draftToHtml(rawContent);
    const text = editorStateValue.getCurrentContent().getPlainText("\u0001");
    formik.setFieldValue("inPortalWebBody", text.length > 0 ? html : "");
    if (text.length === 0) {
      formik.setFieldTouched("inPortalWebBody", true);
    }
  };

  return (
    <div className="grid-container-notification">
      {/* Form Section */}
      <div className="form-holder">
        <form onSubmit={formik.handleSubmit} autoComplete="off">
          <h2>Add New Notification</h2>

          {/* Email Recipients */}
          <div className="formDiv" style={{ marginBottom: 20 }}>
            <label htmlFor="emailRecipients">Email Recipients</label>
            <input
              type="text"
              id="emailRecipients"
              name="emailRecipients"
              placeholder="Enter email addresses, separated by commas"
              value={values.emailRecipients || ""}
              onChange={(e) => setFieldValue("emailRecipients", e.target.value)}
              onBlur={() => setFieldTouched("emailRecipients", true)}
              className="nameInput"
            />
            {formik.touched.emailRecipients &&
              formik.errors.emailRecipients && (
                <div className="displayError">
                  {formik.errors.emailRecipients}
                </div>
              )}
          </div>

          <div className="formDiv" style={{ marginBottom: 20 }}>
            <label htmlFor="notificationScenarioId">
              Notification Scenario
            </label>
            <input
              type="text"
              id="notificationScenarioId"
              name="notificationScenarioId"
              value={values.notificationScenarioId}
              onChange={(e) =>
                setFieldValue("notificationScenarioId", e.target.value)
              }
              onBlur={(e) => {
                setFieldType("notificationScenarioId");
                onBlur(e);
              }}
              className="nameInput"
            />
            {formik.touched.notificationScenarioId &&
              formik.errors.notificationScenarioId && (
                <div className="displayError">
                  {formik.errors.notificationScenarioId}
                </div>
              )}
          </div>

          <hr className="solid" />

          {/* SMS */}
          <div className="form-margin">
            <label className="checkbox-margin">
              <input
                type="checkbox"
                name="smsRequired"
                checked={smsCheckbox}
                onChange={() => handleCheckboxChange("sms")}
              />{" "}
              SMS (Message)
            </label>
            {formik.touched.smsBody && formik.errors.smsBody && (
              <div className="displayError">{formik.errors.smsBody}</div>
            )}
            <textarea
              rows={3}
              name="smsBody"
              value={values.smsBody}
              onChange={(e) => {
                setCur(e.target.selectionStart);
                setFieldValue("smsBody", e.target.value);
              }}
              onBlur={(e) => {
                setFieldType("smsBody");
                onBlur(e);
              }}
              placeholder="Message (Max 100 characters)"
              maxLength={100}
              className="nameInput textarea"
            />
          </div>

          <hr className="solid" />

          {/* Email Notification */}
          <div className="form-margin">
            <label className="checkbox-margin">
              <input
                type="checkbox"
                name="emailRequired"
                checked={emailNotificationCheckbox}
                onChange={() => handleCheckboxChange("email")}
              />{" "}
              Email Notification
            </label>

            <label className="input-label" htmlFor="emailSubject">
              Subject
            </label>
            <input
              type="text"
              name="emailSubject"
              value={values.emailSubject}
              onFocus={(e) => {
                setFieldType("emailSubject");
                setCur(e.target.selectionStart);
              }}
              onChange={formik.handleChange}
              onBlur={(e) => {
                onBlur(e);
                formik.handleBlur(e);
              }}
              placeholder="Subject"
              className="nameInput"
            />
            {formik.touched.emailSubject && formik.errors.emailSubject && (
              <div className="displayError">{formik.errors.emailSubject}</div>
            )}

            <label
              className="input-label"
              htmlFor="emailBody"
              style={{ marginTop: "6px" }}
            >
              Email Message
            </label>
            {formik.touched.emailBody && formik.errors.emailBody && (
              <div className="displayError">{formik.errors.emailBody}</div>
            )}
            <Editor
              editorState={editorStateEmail}
              toolbarClassName="toolbarClassName"
              wrapperClassName="wrapperClassName"
              editorClassName="editorClassName"
              onEditorStateChange={onEditorStateChangeEmail}
              toolbar={toolbar}
              placeholder="Email Message"
              editorStyle={{
                minHeight: 150,
                padding: 10,
                fontSize: 14,
                border: "1px solid #ddd",
              }}
              onBlur={() => checkErrors()}
            />

            <label
              className="input-label"
              htmlFor="emailButtonName"
              style={{ marginTop: "12px" }}
            >
              Link Button Name
            </label>
            <input
              type="text"
              name="emailButtonName"
              value={values.emailButtonName}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="nameInput"
            />
            {formik.touched.emailButtonName &&
              formik.errors.emailButtonName && (
                <div className="displayError">
                  {formik.errors.emailButtonName}
                </div>
              )}
          </div>

          <hr className="solid" />

          {/* In-Portal Notifications */}
          <div className="form-margin">
            <label className="checkbox-margin">
              <input
                type="checkbox"
                name="inPortalWebRequired"
                checked={values.inPortalWebRequired}
                onChange={() => handleCheckboxChange("inPortalWebRequired")}
              />{" "}
              In-Portal Notifications
            </label>

            <label className="input-label" htmlFor="inPortalWebSubject">
              Subject
            </label>
            <input
              type="text"
              name="inPortalWebSubject"
              value={values.inPortalWebSubject}
              onFocus={(e) => {
                setFieldType("inPortalWebSubject");
                setCur(e.target.selectionStart);
              }}
              onChange={formik.handleChange}
              onBlur={(e) => {
                onBlur(e);
                formik.handleBlur(e);
              }}
              placeholder="Subject"
              className="nameInput"
            />
            {formik.touched.inPortalWebSubject &&
              formik.errors.inPortalWebSubject && (
                <div className="displayError">
                  {formik.errors.inPortalWebSubject}
                </div>
              )}

            <label
              className="input-label"
              htmlFor="inPortalWebBody"
              style={{ marginTop: "6px" }}
            >
              In-Portal Message
            </label>
            {formik.touched.inPortalWebBody &&
              formik.errors.inPortalWebBody && (
                <div className="displayError">
                  {formik.errors.inPortalWebBody}
                </div>
              )}
            <Editor
              editorState={editorState}
              toolbarClassName="toolbarClassName"
              wrapperClassName="wrapperClassName"
              editorClassName="editorClassName"
              onEditorStateChange={onEditorInPortalStateChange}
              toolbar={toolbar}
              placeholder="In-Portal Message"
              editorStyle={{
                minHeight: 150,
                padding: 10,
                fontSize: 14,
                border: "1px solid #ddd",
              }}
              onBlur={() => checkErrors()}
            />

            <label
              className="input-label"
              htmlFor="inPortalWebLinkName"
              style={{ marginTop: "12px" }}
            >
              In-Portal Link Name
            </label>
            <input
              type="text"
              name="inPortalWebLinkName"
              value={values.inPortalWebLinkName}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="nameInput"
            />
            {formik.touched.inPortalWebLinkName &&
              formik.errors.inPortalWebLinkName && (
                <div className="displayError">
                  {formik.errors.inPortalWebLinkName}
                </div>
              )}
          </div>

          <hr className="solid" />

          {/* Mobile Push Notifications */}
          <div className="form-margin">
            <label className="checkbox-margin">
              <input
                type="checkbox"
                name="mobilePushRequired"
                checked={values.mobilePushRequired}
                onChange={() => handleCheckboxChange("mobilePushRequired")}
              />{" "}
              Mobile App Push Notifications
            </label>

            <label className="input-label" htmlFor="mobilePushSubject">
              Subject
            </label>
            <input
              type="text"
              name="mobilePushSubject"
              value={values.mobilePushSubject}
              onFocus={(e) => {
                setFieldType("mobilePushSubject");
                setCur(e.target.selectionStart);
              }}
              onChange={formik.handleChange}
              onBlur={(e) => {
                onBlur(e);
                formik.handleBlur(e);
              }}
              placeholder="Subject"
              className="nameInput"
            />
            {formik.touched.mobilePushSubject &&
              formik.errors.mobilePushSubject && (
                <div className="displayError">
                  {formik.errors.mobilePushSubject}
                </div>
              )}

            <label
              className="input-label"
              htmlFor="mobilePushBody"
              style={{ marginTop: "6px" }}
            >
              Mobile App Message
            </label>
            {formik.touched.mobilePushBody && formik.errors.mobilePushBody && (
              <div className="displayError">{formik.errors.mobilePushBody}</div>
            )}
            <textarea
              rows={3}
              name="mobilePushBody"
              value={values.mobilePushBody}
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
              placeholder="Mobile App Message"
              className="nameInput textarea"
            />
          </div>

          <hr className="solid" />

          <label className="checkbox-margin">
            <input
              type="checkbox"
              name="isActive"
              checked={isActive}
              onChange={() => handleCheckboxChange("isActive")}
            />{" "}
            Is Active
          </label>

          <div style={{ marginTop: 20 }}>
            <button type="submit" className="btn-submit">
              Save
            </button>
            <button
              type="button"
              onClick={() => navigate("/admin/notifications")}
              className="btn-cancel"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>

      {/* Variables Section */}
      <div className="variables-container">
        <h3>Static Variables</h3>
        {staticVariables.map((variable) => (
          <button
            key={variable.name}
            type="button"
            onClick={() => sendTextToEditor(variable.name)}
            className="static-button"
          >
            {variable.name}
          </button>
        ))}
        <small>Click to insert into the selected field</small>
      </div>
    </div>
  );
};

export default AddNewNotification;
