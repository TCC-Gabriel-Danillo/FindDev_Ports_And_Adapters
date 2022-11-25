import React from "react";
import {
  UserContextProps,
  UserContextProvider,
  AuthContextProvider,
  AuthContextProviderProps,
} from "../../../context";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import { Routes } from "../../../navigation";
import { BUTTON_TEST_ID } from "../../../pages/inital";
import { act } from "react-test-renderer";
import { authContexDefaultProps, LocalStorageStub, POSITION, userContexDefaultProps, UserServiceStub, UserStub } from "./Stubs";

// MOCKS

const mockPosition = {...POSITION};

jest.mock("../../../hooks/useLocation", () => ({
  ...jest.requireActual("../../../hooks/useLocation"),
  useLocation: () => ({
    getPositionAsync: async ()=>({...mockPosition})
  }),
}));

beforeEach(() => {
  jest.clearAllMocks();
});

// Functions

const renderComponent = (
  authContextProps: Omit<AuthContextProviderProps, "children">,
  userContextProps: Omit<UserContextProps, "children">
) => {
  return (
    <AuthContextProvider {...authContextProps}>
      <UserContextProvider {...userContextProps}>
        <Routes />
      </UserContextProvider>
    </AuthContextProvider>
  );
};

describe("Initial Page", () => {
  it("Must create user if User does not exist", async () => {
    jest.mock("@react-navigation/native", () => ({
      ...jest.requireActual("@react-navigation/native"),
      useNavigation: () => ({
        navigate: jest.fn(),
      }),
    }));

    const { findByTestId } = render(
      renderComponent(authContexDefaultProps, userContexDefaultProps)
    );

    const button = await findByTestId(BUTTON_TEST_ID);

    await act(() => {
      fireEvent.press(button);
    });

    expect(UserServiceStub.createUser).toBeCalledWith(UserStub);
  });

  it("Must update user if User exist", async () => {
    const localStorage = {
      ...LocalStorageStub,
      getItem: jest.fn(async () => UserStub),
    };

    const _authContexDefaultProps = {
      ...authContexDefaultProps,
      localStorage,
    } as Omit<AuthContextProviderProps, "children">;

    const _userContexDefaultProps = {
      ...userContexDefaultProps,
      localStorage,
    } as Omit<UserContextProps, "children">;
    
    
    await waitFor(() => {
      render(renderComponent(_authContexDefaultProps, _userContexDefaultProps));
    });

    expect(UserServiceStub.createUser).toBeCalledWith(UserStub);
  });
});
