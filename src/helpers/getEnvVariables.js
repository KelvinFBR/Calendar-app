//* Esta es la forma que debemos usar por el momento
export const getEnvVariables = () => {
  // import.meta.env;

  return {
    VITE_API_URL: import.meta.env.VITE_API_URL,
    //     ...import.meta.env,
  };
};

//* Esta es una de las formas que cuando vite solucionen el error de la importaciones de meta.env podemos usar
// export const getEnvVariables = () => {
//   import.meta.env;

//   return {
//     ...import.meta.env,
//   };
// };
