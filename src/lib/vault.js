import DeepVault from "deepvault";

const userVault = new DeepVault();
const tokenVault = new DeepVault();

const getUserData = async () => {
  return await userVault.getDecryptedData();
};

const saveUserData = async () => {
  return await userVault.encryptAndSaveData();
};

const deleteUserData = () => {
  return userVault.deleteData();
};

const getToken = async () => {
  return await tokenVault.getDecryptedData();
};

const saveToken = async () => {
  return await tokenVault.encryptAndSaveData();
};

const deleteToken = () => {
  return tokenVault.deleteData();
};
