import React from "react";
import Button from "@mui/material/Button";
import ContentMenu from "../ContextMenu";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

const button = (
  <>
    <Button size="small" sx={{ textTransform: "none" }}>
      test1
    </Button>
  </>
);

const Component = ({ x = 100, y = 100, children = button, showCtxMenu = true }) => {
  return <ContentMenu x={x} y={y} children={children} showCtxMenu={showCtxMenu} />;
};

test("renders context menu", () => {
  render(<Component />);
  const menu = screen.getByTestId(/ctx-menu/i);
  expect(menu).toBeVisible();
});

test("renders context menu children", () => {
  render(<Component />);
  const button = screen.getByText(/test1/i);
  expect(button).toBeVisible();
});

test(" doesnt render context menu if showCtxMenu = false", () => {
  const { rerender } = render(<Component showCtxMenu={false} />);
  const menu = screen.queryByTestId(/ctx-menu/i);
  expect(menu).toBeNull();
  rerender(<Component showCtxMenu={true} />);
  const menu2 = screen.getByTestId(/ctx-menu/i);
  expect(menu2).toBeVisible();
});

test("positioning is correct through x, y props", () => {
  render(<Component />);
  const menu = screen.getByTestId(/ctx-menu/i);
  const style = window.getComputedStyle(menu);
  expect(style.left).toEqual("100px");
  expect(style.top).toEqual("100px");
});

test("positioning changes when x, y props changed", () => {
  const { rerender } = render(<Component />);
  const menu = screen.getByTestId(/ctx-menu/i);
  let style = window.getComputedStyle(menu);
  expect(style.left).toEqual("100px");
  expect(style.top).toEqual("100px");
  rerender(<Component x={200} y={200} />);
  style = window.getComputedStyle(menu);
  expect(style.left).toEqual("200px");
  expect(style.top).toEqual("200px");
});
