# gestion de calendarios con react

Con este paquete podemos gestionar un calendario con react.

[react-big-calendar](https://www.npmjs.com/package/react-big-calendar)

Instalacion:

```
npm i react-big-calendar
```

# Modals con react

Con este paquete podemos hacer uso de modales en react

[react-modal](https://www.npmjs.com/package/react-modal)

Instalacion:

```
npm i react-modal
```

# Paquete react-datepicker

Est paquete nos ayuda a poder seleccionar las fechas y horas de una forma mas facil.

[react-datepicker](https://www.npmjs.com/package/react-datepicker)

Instalacion:

```
npm i react-datepicker
```

> Cuando estemos instalando algun paquete siempre debemos de tener en cuenta la cantidad de dependencias que utiliza ya que si contiene pocas dependencias es menos probable que falle a futuro.

# Preparacion redux toolkit

[Redux-docs](https://es.redux.js.org/)
[Redux-toolkit](https://redux-toolkit.js.org/)
[React-Redux](https://react-redux.js.org/)

Aqui podemos encontra la forma de instalar redux-toolkit y las docs oficial:

[redux-toolkit-getting-started](https://redux-toolkit.js.org/introduction/getting-started)

instalaciones

```
npm install @reduxjs/toolkit
```

```
npm install react-redux
```

# Creando variables de entorno

Como estamos usando vite para exponer las variables que cremos en `import.meta.env` debemos de colocar la palabra VITE Seguido de el nombre que queramos:

```
VITE_API_URL=http://localhost:5000/api/
```

para hacer uso de ella hacemos los siguente

```js
import.meta.env;
```

Se acostumbra a crear una funcion para que retorne todas esa variables para hacer mas facil el testing y varias cosas mas:

**helpers/getEnvVAriables.js**

```js
export const getEnvVariables = () => {
  //* traigo las variables de entorno. Como vite lo plnatea
  import.meta.env;

  return {
    //* Aqui esparcimos todas las variables
    ...import.meta.env,
  };
};
```

En otro archivo solo importamos y llamamos a la funcion y nos retiornara un objeto con todos las variables de entorno

> Algo que debemos saber es que nos se acostumbra a subir el `.env` ya que esto es privado o cada dev tuene sus propias key y variables para acceder. mayormente se coloca un `.env.template` para hay colocar las variables necesarias para nuestra app.

Si es algo que no se explica facil por si solo es bueno colocar un `README.md` en el cual coloquemo los paso a realizar

# Axios init

Para usar axios debemos de instalar el paquete:

```
 npm i axios
```

Esta estructura que usaremos para organizar nuestra peticiona a nuestros endpoints, Nosotros creamos una carpeta `api` en la cual crearemos un `index.js` como archivo de barril y crearemos un enpoints para cada una de las variaciones que tengamos ej: para el calendar, auth etc...

# Mantener la sesion del usuario

En teoria si tenemos el JWT y este no a expirado entonces estamos autenticado. Nosotros para validar ese token tenemos un endpoint en el cual lo validamos y si el token el valido aun este nos mandara un nuevo token para asi mantener el usuario activo mientra utiliza nuestra app si el token no es valido nos dara un mensaje de error de que el token no es valido y si no es valido mandamos al usuario a logiarse para obtener su nuevo token y seguir trabajando.

## Configurar interceptores

Los interceptores es algo que nos va a ayudar a interceptar una peticion antes o despues de que se haga y añadir o modificar la respuesta

Esta es la manera de crear un interceptor en axios. Exiten 2 interceptors request para cuando estamos mandando la peticion y el response cuando estamos resiviendo la peticion en este caso usaremos response para mandar los headers.

Con el use le indicamos que use este interceptor que loe pasaremos este user recibe un callback el cual contiene la config y este callback debe de retornar la config ya con su modificaciones

**api/calendarAPI.js**

```js
calendarApi.interceptors.request.use((config) => {
  // Aqui podemos quitar o agragar headers y hacer lo que queramos.
  config.headers = {
    // si por exister headers adicionales los esparcimos aqui
    ...config.headers,
    "x-token": localStorage.getItem("token"),
  };

  return config;
});
```

> Este mandara adicionalmente el token en los headers para cualquier peticion que se haga con el calendarApi y si no existe el token este mandar undefined y el backend nos retornara que este usuario no esta autenticado.

Para mantener la sesion crearemos una funcion que sale de nuestros customs hooks para validar si el token es valido o no y si es valido colocar o mantener al usuario activo

```js
const checkAuthToken = async () => {
  const token = localStorage.getItem("token");
  if (!token) return dispatch(onLogout());

  try {
    const { data } = await calendarApi.get("/auth/renew");

    //* si todo va bien nos retornara un nuevo token y ya que en nuevo lo almacenamos en el localStorage
    localStorage.setItem("token", data.token);
    localStorage.setItem("token-init-date", new Date().getTime());

    //* como es valido mantenamos al usuario logiado
    dispatch(onLogin({ name: data.name, uid: data.uid }));
  } catch (error) {
    // limpiamos el localStorage ya que el token no funcion
    localStorage.clear();
    dispatch(onLogout());
  }
};
```

Algo que debemos saber es que esta fucnion la usaremos el una partendo sea necesario estar comprobando si es valido el token para mantener la sessiones en este caso lo usaremos en nuestro appRouter ya que aqui es donde estas nuestras rutas publicas y privadas asi cada vez que se renderice este componente tambien compobaremos si el usuario esta autenticado.

De esta manera renderizamos las rutas necesarias para el usuario. Si el usuario esta autenticado es decir que el token que esta en localStorage es valido si es valido el backend nos retornara un nuevo token con el uid y el name del usaurio al cual le pertenece ese token y si el token no es valido entonces este hara un logout y cambiara el status cambiando tambien las rutas a solo las publicas.

```jsx
export const AppRouter = () => {
  const { status, checkAuthToken } = useAuthStore();

  //* cada vez que el AppRouter se renderice va a ejecutar este checkAuthToken
  useEffect(() => {
    checkAuthToken();
  }, []);

  if (status === "checking") {
    return (
      <>
        <h3>Cargando...</h3>
      </>
    );
  }

  return (
    <Routes>
      {status === "not-authenticated" ? (
        <>
          <Route path="/auth/*" element={<LoginPage />} />
          <Route path="/*" element={<Navigate to="/auth/login" />} />
        </>
      ) : (
        <>
          <Route path="/" element={<CalendarPage />} />
          <Route path="/*" element={<Navigate to="/calendar" />} />
        </>
      )}
    </Routes>
  );
};
```

## Posible loading

**loginPage.jsx**

```js
{
  status === "checking" ? (
    <>
      <div className="loader">
        <div className="lds-ellipsis">
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
      </div>
    </>
  ) : (
    ""
  );
}
```
