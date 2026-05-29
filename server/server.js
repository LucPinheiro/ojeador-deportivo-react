// console.clear();
require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const fileUpload = require('express-fileupload');
const cors = require('cors');

const app = express();
app.use(cors());

// Render asigna PORT automáticamente.
const PORT = process.env.PORT || 3000;

/**
 * #################
 * ## Middlewares ##
 * #################
 */
const userExists = require('./middlewares/userExists');
const authUser = require('./middlewares/authUser');
const canAddProfile = require('./middlewares/canAddProfile');
const canEdit = require('./middlewares/canEdit');
const profileExists = require('./middlewares/profileExists');

// CONTROLADORES DE PERFIL DE JUGADORES
const {
  newProfile,
  addProfilePhoto,
  addVideos,
  addSkill,
  deletePhoto,
  listProfiles,
  deleteSkills,
  getProfile,
  deleteProfile,
  editProfile,
  deleteVideos,
  sendContract,
} = require('./controllers/profiles');

// CONTROLADORES DE USUARIOS
const {
  newUser,
  loginUser,
  validateUser,
  getUser,
  editPass,
  resetPass,
  recoverPass,
  deleteUser,
  editUser,
} = require('./controllers/users');

// Logger
app.use(morgan('dev'));

// Deserializamos JSON.
app.use(express.json());

// Deserializamos form-data.
app.use(fileUpload());

// Mostrar archivos estáticos
app.use('/fotos', express.static('static/uploads'));

/*############################
ENDPOINTS PERFILES JUGADORES
############################*/

// Crea un nuevo perfil
app.post('/new-profile', authUser, canAddProfile, newProfile);

// Lista los perfiles
app.get('/profiles', listProfiles);

// Seleccionar un perfil con su info completa
app.get('/profiles/:idProfile', authUser, profileExists, getProfile);

// Editar un perfil
app.put('/profiles/:idProfile', authUser, profileExists, canEdit, editProfile);

// Borrar un perfil
app.delete(
  '/profiles/:idProfile',
  authUser,
  profileExists,
  canEdit,
  deleteProfile
);

// Adicionar skill
app.post(
  '/profiles/:idProfile/skills',
  authUser,
  profileExists,
  canEdit,
  addSkill
);

// Eliminar una skill
app.delete(
  '/profiles/:idProfile/skills/:idSkill',
  authUser,
  profileExists,
  canEdit,
  deleteSkills
);

// Adicionar fotos
app.post(
  '/profiles/:idProfile/photos',
  authUser,
  profileExists,
  canEdit,
  addProfilePhoto
);

// Eliminar foto
app.delete(
  '/profiles/:idProfile/photos/:idPhoto',
  authUser,
  profileExists,
  canEdit,
  deletePhoto
);

// Adicionar vídeos
app.post(
  '/profiles/:idProfile/videos',
  authUser,
  profileExists,
  canEdit,
  addVideos
);

// Eliminar vídeos
app.delete(
  '/profiles/:idProfile/videos/:idVideo',
  authUser,
  profileExists,
  canEdit,
  deleteVideos
);

// Oferta de contratación
app.post(
  '/profiles/:idProfile/contract',
  authUser,
  profileExists,
  sendContract
);

/*############################
ENDPOINTS USUARIOS
############################*/

// Crear usuario
app.post('/register', newUser);

// Login
app.post('/users', loginUser);

// Validar usuario
app.get('/users/validate/:registrationCode', validateUser);

// Obtener usuario
app.get('/users/:idUser', authUser, userExists, getUser);

// Editar usuario
app.put('/user/:idUser', authUser, userExists, editUser);

// Editar contraseña
app.put('/users/:idUser/password', authUser, userExists, editPass);

// Recuperar contraseña
app.put('/users/password/recover', recoverPass);

// Resetear contraseña
app.put('/users/password/reset', resetPass);

// Eliminar usuario
app.delete('/users/:idUser', authUser, userExists, deleteUser);

/**
 * ######################
 * ## Middleware Error ##
 * ######################
 */
app.use((error, req, res, next) => {
  console.error(error);

  res.status(error.httpStatus || 500).send({
    status: 'error',
    message: error.message,
  });
});

/**
 * ##########################
 * ## Middleware Not Found ##
 * ##########################
 */
app.use((req, res) => {
  res.status(404).send({
    status: 'error',
    message: 'Not found',
  });
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
