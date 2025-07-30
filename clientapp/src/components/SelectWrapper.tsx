import { useEffect, useState } from "react";
import ReactSelect, { GroupBase, Props } from "react-select";
// import OutlinedX from "@/assets/icons/dropdownClose.svg?react";
import Clickable from "./Custom/Clickable";

interface SelectCustomProps {
  shouldSort?: boolean;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const ClearIndicator = ({ clearValue, innerProps }: any) => (
  <Clickable
    onClick={(e) => {
      e.preventDefault();
      e.stopPropagation();
      clearValue();
    }}
  >
    {/* <OutlinedX {...innerProps} className="cursor-pointer" /> */}
  </Clickable>
);
const SelectWrapper = <
  Option,
  IsMulti extends boolean = false,
  Group extends GroupBase<Option> = GroupBase<Option>
>({
  styles,
  ...props
}: Props<Option, IsMulti, Group> & SelectCustomProps) => {
  const [state, setState] = useState<typeof props.options>([]);

  const _onMenuClose = () => {
    if (props.shouldSort) {
      setState((prev) => {
        if (!prev) return prev;

        if (Array.isArray(props.value)) {
          const selectedIds = props.value.map((item) =>
            "getOptionValue" in props
              ? //@ts-expect-error CANNOT INVOKE
                props.getOptionValue(item)
              : item["value"]
          );
          prev =
            props.options?.filter(
              (item) =>
                !selectedIds.includes(
                  //@ts-expect-error CANNOT INVOKE
                  props.getOptionValue(item) ?? item["value"]
                )
            ) || [];
          //@ts-expect-error DOES NOT EXISTS
          prev?.splice(1, 0, ...props.value);
        }

        return [...prev];
      });
    }
  };

  useEffect(() => {
    if (!state?.length) setState(props.options);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.options]);

  return (
    <ReactSelect
      isSearchable={false}
      backspaceRemovesValue={false}
      styles={{
        menuPortal: (styles) => ({
          ...styles,
          zIndex: 100,
        }),
        control: (styles, { isFocused }) => ({
          ...styles,
          backgroundColor: "white",
          borderColor: isFocused ? "#F5862D" : styles.borderColor,
        }),

        singleValue: (styles) => ({ ...styles, fontSize: "small" }),
        placeholder: (styles) => ({ ...styles, fontSize: "small" }),
        indicatorSeparator: () => ({ display: "none" }),
        dropdownIndicator: (styles, { selectProps }) => ({
          ...styles,
          transform: selectProps.menuIsOpen ? "rotate(180deg)" : "rotate(0deg)",
        }),
        valueContainer: (styles) => ({
          ...styles,
          padding: "2px 5px",
          flexWrap: "nowrap",
        }),
        menuList: (styles) => ({ ...styles, overflowX: "visible" }),
        option: (styles, { isDisabled, isSelected }) => {
          return {
            ...styles,
            backgroundColor: isSelected ? "#F5862D" : "white",
            cursor: isDisabled ? "not-allowed" : "default",
            textOverflow: "ellipsis",
            fontSize: "small",
            maxWidth: "100%",
            overflowX: "clip",
          };
        },
        ...styles,
      }}
      menuPortalTarget={document.body}
      menuPlacement="auto"
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      closeMenuOnScroll={(e: any) => {
        if (e.target === document) {
          return false;
        }
        return !e?.target?.id?.includes("react-select");
      }}
      {...props}
      placeholder={props.placeholder ? props.placeholder : "Select..."}
      components={{
        ...props.components,
        ClearIndicator,
      }}
      options={props.shouldSort ? state : props.options}
      onMenuClose={_onMenuClose}
      onMenuOpen={() => {
        document.dispatchEvent(
          new MouseEvent("click", {
            bubbles: true,
            cancelable: true,
          })
        );
      }}
    />
  );
};

export default SelectWrapper;
