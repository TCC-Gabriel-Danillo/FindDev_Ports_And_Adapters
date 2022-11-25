import React from "react";
import {
  AuthUseCase,
  Position,
  User,
  UserCredential,
  UserUseCase,
} from "@domain/entities";
import { HttpRepository, LocalStorageRepository } from "@domain/repositories";
import { GitRepository, GitUser } from "@infrastructure/dto";
import {
  UserContextProps,
  UserContextProvider,
  AuthContextProvider,
  AuthContextProviderProps,
} from "../../context";
import { render, fireEvent } from "@testing-library/react-native";
import { Routes } from "../../navigation";
import { BUTTON_TEST_ID } from "../../pages/inital";
import { act } from "react-test-renderer";

const FAKE_TOKEN = "github_fake_token";
const USER_ID = 1234;
const USER_EMAIL = "user@email.com";
const GEOHASH = "eqwe132";
const POSITION = {
  latitude: 37.09739685,
  longitude: -24.55375671,
} as Position;
const USERNAME = "username";
const PHOTO_URL = "photo/url";
const PROFILE_URL = "profile/url";

const AUTH_SESSION = {
  type: "success",
  params: {
    code: "any_value",
  },
};

const CREDENTIALS = {
  code: "any_value",
  client_id: undefined,
  client_secret: undefined,
};

const geohashGeneratorMock = jest.fn(() => GEOHASH);

const UserCredentialStub = {
  operationType: "signIn",
  providerId: 9876,
  user: {
    email: USER_EMAIL,
    photoURL: PHOTO_URL,
  },
} as unknown as UserCredential;

const AuthServiceStub = {
  getOAuthHeader: () => ({
    headers: {
      authorization: FAKE_TOKEN,
    },
  }),
  getOAuthToken: () => FAKE_TOKEN,
  setOAuthToken: jest.fn(),
  signInWithCredentials: jest.fn(async () => UserCredentialStub),
} as AuthUseCase;

const GithubApiStub = {
  get: jest.fn(async (url: string) => {
    if (url.includes(USER_EMAIL)) return GitUserStub;
    return GitRepositoryStub;
  }),
  post: jest.fn(async (url, data) => {
    return UserStub;
  }),
} as HttpRepository;

const GitUserStub = {
  items: [
    {
      email: USER_EMAIL,
      id: USER_ID,
      html_url: PROFILE_URL,
      login: USERNAME,
      avatar_url: PHOTO_URL,
    },
  ],
} as GitUser;

const GitRepositoryStub = [
  { language: "C" },
  { language: "JavaScript" },
  { language: "Java" },
  { language: "C++" },
] as GitRepository[];

const UserStub = {
  geohash: GEOHASH,
  email: USER_EMAIL,
  username: USERNAME,
  id: USER_ID,
  techs: GitRepositoryStub.map((tech) => tech.language),
  photoUrl: PHOTO_URL,
  profileUrl: PROFILE_URL,
  position: {},
} as User;

const LocalStorageStub = {
  setItem: jest.fn(async () => {}),
  getItem: jest.fn(async () => {}),
  removeItem: jest.fn(async () => {}),
} as LocalStorageRepository;

const UserServiceStub = {
  createUser: jest.fn(async () => undefined),
  getUser: jest.fn(async () => UserStub),
  listUsers: jest.fn(async () => [UserStub]),
} as UserUseCase;

const userContexDefaultProps = {
  authService: AuthServiceStub,
  geohashGenerator: geohashGeneratorMock,
  githubApi: GithubApiStub,
  localStorage: LocalStorageStub,
  userService: UserServiceStub,
};

const authContexDefaultProps = {
  authService: AuthServiceStub,
  localStorage: LocalStorageStub,
  promptAsync: jest.fn(async () => AUTH_SESSION),
} as Omit<AuthContextProviderProps, "children">;

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


beforeEach(()=>{
  jest.clearAllMocks();
})

describe("Initial Page", () => {
  it("Must create user if Authentication user does not exist", async () => {
    const { findByTestId } = render(
      renderComponent(authContexDefaultProps, userContexDefaultProps)
    );

    const button = await findByTestId(BUTTON_TEST_ID);

    await act(() => {
      fireEvent.press(button);
    });

    expect(UserServiceStub.createUser).toBeCalledWith(UserStub);
  });

});
