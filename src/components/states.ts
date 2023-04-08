import { atom, selector } from "recoil";

const secureCodeState = atom({
  key: "secureCodeState",
  default: "",
});
const isUserLoggedInState = selector({
  key: "isUserLoggedInState",
  get: ({ get }) => {
    const secureCode = get(secureCodeState);
    return secureCode !== "";
  },
});

export { secureCodeState, isUserLoggedInState };
