export function requestHeader(authorization, contentType = 'application/json') {
  const result = {};

  if (contentType) {
    result['Content-Type'] = contentType;
  }

  // if (authorization) {
  //   const token = getToken();
  //   if (token) {
  //     result.Authorization = `Bearer ${token}`;
  //   }
  // }

  return result;
}
