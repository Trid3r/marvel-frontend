import jwt from 'expo-jwt';
import cookies from 'js-cookie';

const getCurrentUser = () => {
  const token = cookies.get("user");

  if(token != null){
    try {
      const user = jwt.decode(token, "watchmen_is_better_than_marvel_and_dc");
      return user;
    } catch (error) {
      console.error('Error al decodificar el token:', error);
      return null;
    }
  } else return null;
};

const setCurrentUser = () => {
  const token = jwt.encode({ name: 'trider' }, "watchmen_is_better_than_marvel_and_dc");
  cookies.set("user", token, { expires: new Date(Date.now() + 3600000) });
};

const authService = {
  getCurrentUser,
  setCurrentUser
};

export default authService;