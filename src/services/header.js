import cookies from 'js-cookie';

export default function header() {
  const token = cookies.get("user");

  if (token) {
    return { Authorization: 'Bearer ' + token };
  } else {
    return {};
  }
}
