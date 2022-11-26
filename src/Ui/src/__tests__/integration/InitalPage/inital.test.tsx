import React from "react";
import {
  UserContextProps,
  UserContextProvider,
  AuthContextProvider,
  AuthContextProviderProps,
} from "../../../context";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import InitialPage, { BUTTON_TEST_ID } from "../../../pages/inital";
import { act } from "react-test-renderer";
import { userContexProps, authContexProps, POSITION, GEOHASH, USER_EMAIL, USERNAME, USER_ID, GitRepositoryStub, PHOTO_URL, PROFILE_URL } from "../Stubs";
import { NavigationContainer } from "@react-navigation/native";
import { STORAGE_KEYS } from "../../../constants";

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
  authContextProps: AuthContextProviderProps,
  userContextProps: UserContextProps
) => {
  return (
    <AuthContextProvider {...authContextProps}>
      <UserContextProvider {...userContextProps}>
        <NavigationContainer>
          <InitialPage/>
        </NavigationContainer>
      </UserContextProvider>
    </AuthContextProvider>
  );
};

// Final Values

const UserFinalValue = {
  geohash: GEOHASH,
  email: USER_EMAIL,
  username: USERNAME,
  id: USER_ID,
  techs: GitRepositoryStub.map((tech) => tech.language),
  photoUrl: PHOTO_URL,
  profileUrl: PROFILE_URL,
  position: POSITION,
};

describe("Initial Page", () => {
  it("Must create user if User does not exist", async () => {

    const { findByTestId } = render(
      renderComponent(authContexProps, userContexProps)
    );

    const button = await findByTestId(BUTTON_TEST_ID);

    await act(() => {
      fireEvent.press(button);
    });

    expect(userContexProps.userService.createUser).toBeCalledWith(UserFinalValue);
  });

  it("Must update user if User exist", async () => {
    const genericKey = "genericKey"
    const position = {
      latitude: 10,
      longitude: 10,
    }

    await authContexProps.localStorage.setItem(genericKey,{...UserFinalValue, position})

    await waitFor(() => render(renderComponent(authContexProps, userContexProps)));

    expect(userContexProps.userService.createUser).toBeCalledWith(UserFinalValue);
  });

  it("Must save user as soon as it's authenticated", async () => {

    await waitFor(() => render(renderComponent(authContexProps, userContexProps)));
    expect(userContexProps.localStorage.setItem).toBeCalledWith(STORAGE_KEYS.USERS, UserFinalValue);
    
  });
});
