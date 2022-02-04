import React from "react";
import Inputs from "../Inputs";
import MenuItem from "@mui/material/MenuItem";

import { render, fireEvent, within, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

const mockHandleChange = jest.fn();

const Component = ({ type = "text", placeholder = "test", ...props }) => {
  return <Inputs {...props} type={type} handleChange={mockHandleChange} placeholder={placeholder} />;
};

const ComponentWithSelect = ({ type = "text", placeholder = "test", ...props }) => {
  return (
    <Inputs
      {...props}
      type={type}
      handleChange={mockHandleChange}
      placeholder={placeholder}
      select={true}
      defaultValue=""
    >
      <MenuItem value="privacy">Privacy</MenuItem>
      <MenuItem value="my-account">My Account</MenuItem>
    </Inputs>
  );
};

describe("Testing input prop values on mount", () => {
  test("renders inputs component", () => {
    render(<Component />);
    const input = screen.getByTestId(/input/i);
    expect(input).toBeInTheDocument();
  });

  test("expect input value to be empty on render", () => {
    render(<Component />);
    const input = screen.getByPlaceholderText(/test/i);
    expect(input.value).toBe("");
  });

  test("expect input value to be not empty if input passed in ", () => {
    render(<Component value="new value" />);
    const input = screen.getByPlaceholderText(/test/i);
    expect(input.value).toBe("new value");
  });
});

describe("onChange testing", () => {
  test("expect onChange to be called and change value", async () => {
    render(<Component />);
    const input = screen.getByPlaceholderText(/test/i);
    fireEvent.change(input, { target: { value: "new value", name: "name" } });
    expect(mockHandleChange).toHaveBeenCalledWith("new value", "name");
    expect(input.value).toBe("new value");
  });

  test("testing on change time calls", async () => {
    render(<Component />);
    const input = screen.getByPlaceholderText(/test/i);
    fireEvent.change(input, { target: { value: "new value" } });
    fireEvent.change(input, { target: { value: " value" } });
    expect(mockHandleChange).toHaveBeenCalledTimes(2);
  });

  test("testing on change number type", async () => {
    render(<Component type="number" />);
    const input = screen.getByPlaceholderText(/test/i);
    fireEvent.change(input, { target: { value: "new value" } });
    expect(input.value).not.toBe("new value");
    fireEvent.change(input, { target: { value: 10 } });
    expect(input.value).toBe("10");
  });
});
describe("select testing", () => {
  test("test select options  renders", async () => {
    const { getByRole } = render(<ComponentWithSelect />);
    fireEvent.mouseDown(getByRole("button"));
    const listbox = within(getByRole("listbox"));
    const option = listbox.getByText("Privacy");
    expect(option).toBeInTheDocument();
  });

  test("expect clcicking on option runs handle change", async () => {
    const { getByRole } = render(<ComponentWithSelect />);
    const input = screen.getByPlaceholderText(/test/i);
    fireEvent.mouseDown(getByRole("button"));
    const listbox = within(getByRole("listbox"));
    fireEvent.click(listbox.getByText(/my account/i));
    expect(mockHandleChange).toHaveBeenCalledWith("my-account", undefined);
    expect(input.value).toBe("my-account");
  });
});
