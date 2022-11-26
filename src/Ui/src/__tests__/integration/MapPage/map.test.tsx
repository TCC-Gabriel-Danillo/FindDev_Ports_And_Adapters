import { NavigationContainer } from "@react-navigation/native";
import {
  fireEvent,
  render,
  waitFor,
} from "@testing-library/react-native";
import { act } from "react-test-renderer";
import {
  LOGOUT_BUTTON_TEST_ID,
  MAP_TEST_ID,
  MARKER_TEST_ID,
} from "../../../pages/map";
import {
  AuthContextProvider,
  AuthContextProviderProps,
  UserContextProps,
  UserContextProvider,
} from "../../../context";
import { MapPage } from "../../../pages/";
import {
  userContexProps,
  authContexProps,
  POSITION,
  GEOHASH,
  USER_EMAIL,
  USERNAME,
  USER_ID,
  GitRepositoryStub,
  PHOTO_URL,
  PROFILE_URL,
} from "../Stubs";

const mockPosition = { ...POSITION };

jest.mock("../../../hooks/useLocation", () => ({
  ...jest.requireActual("../../../hooks/useLocation"),
  useLocation: () => ({
    position: mockPosition,
  }),
}));

const renderComponent = (
  authContextProps: AuthContextProviderProps,
  userContextProps: UserContextProps
) => {
  return (
    <AuthContextProvider {...authContextProps}>
      <UserContextProvider {...userContextProps}>
        <NavigationContainer>
          <MapPage/>
        </NavigationContainer>
      </UserContextProvider>
    </AuthContextProvider>
  );
};

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

beforeEach(() => {
  jest.clearAllMocks();
});

describe("Map Page", () => {
  it("Must list all the users next to coordinates", async () => {
    userContexProps.userService.createUser(UserFinalValue);

    const { findByTestId } = render(
      renderComponent(authContexProps, userContexProps)
    );

    const markerTestId = `${MARKER_TEST_ID}_${UserFinalValue.id}`;

    const map = (await findByTestId(MAP_TEST_ID)).props;
    const userMarker = (await findByTestId(markerTestId)).props;

    expect(map.children.length).toBe(1);
    expect(userMarker.coordinate).toMatchObject(UserFinalValue.position);
  });

  it("Must update users when map is scrolled", async () => {

    const { findByTestId } = await waitFor(()=>
      render(renderComponent(authContexProps, userContexProps))
    )

    const map = await findByTestId(MAP_TEST_ID)

    await act(() => {
      fireEvent(map,'onRegionChangeComplete', {latitude:20, longitude: 20});
    });

    expect(userContexProps.userService.listUsers).toBeCalledTimes(2)
  })

  it("Must logout when floatting button is pressed", async () => {
    const genericKey = "generic_key";

    userContexProps.userService.createUser(UserFinalValue);
    authContexProps.localStorage.setItem(genericKey, UserFinalValue);

    const { findByTestId } = await waitFor(() =>
      render(renderComponent(authContexProps, userContexProps))
    );

    await act(async () => {
      const button = await findByTestId(LOGOUT_BUTTON_TEST_ID);
      fireEvent.press(button);
    });

    expect(
      await authContexProps.localStorage.getItem(genericKey)
    ).toMatchObject({});
    expect(
      await userContexProps.localStorage.getItem(genericKey)
    ).toMatchObject({});
  });
});
