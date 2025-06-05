import DeepVault from "deepvault";

const userVault = new DeepVault("userData");
const tokenVault = new DeepVault("token");

export const getUserData = async () => {
  return await userVault.getDecryptedData();
};

export const checkUserDataExists = () => {
  const data = userVault.getEncryptedData();
  return data !== null && data !== undefined;
};

export const saveUserData = async () => {
  return await userVault.encryptAndSaveData();
};

export const deleteUserData = () => {
  return userVault.deleteData();
};

export const getToken = async () => {
  return await tokenVault.getDecryptedData();
};

export const saveToken = async () => {
  return await tokenVault.encryptAndSaveData();
};

export const deleteToken = () => {
  return tokenVault.deleteData();
};
