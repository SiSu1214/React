const rootFolder = __dirname;
const uploadsFolderName = 'uploads/';
const adminUploads = 'admin_uploads/';

const port = process.env.PORT || 3000;
const domain = process.env.PROJ_DOMAIN || 'http://localhost';
const isLocal = !!(domain === 'http://localhost');

// const Constant =
exports = module.exports = {
  SecrectKey: process.env.PROJ_SECRECTKEY || 'temp_!2#4',
  mongodb_connect_str:
    'mongodb://127.0.0.1:27017/' + (process.env.PROJ_DATABASE_NAME || 'temp'),
  root_folder: rootFolder,
  static_folder: 'static',
  domain,
  port,
  // OSTYPE:
  aos: 1, // android: 1
  ios: 2, // iphone: 2
  wos: 3, // webbrowser: 3

  //  MAILSERVER
  admin_email: 'androidteamt@gmail.com',
  admin_email_password: '@@25251325##',
  admin_email_domain: 'smtp.yandex.com',
  admin_email_to_contact: 'contact@pdteam.net',

  // GOOGLEMAPAPI
  // GOOGLEPLACEAPI
  // GOOGLE_PLACES_API_KEY: 'AIzaSyCrbU0dkbBHOmp_50Vfy0ydr9-F5J-IVro',
  //   GOOGLE_PLACES_API_KEY: 'AIzaSyARBM7dbmgsL0gqKbnauc_4mIdrTokxK4o',
  //   GOOGLE_PLACES_OUTPUT_FORMAT: 'json',

  //   // FCMCONSTANT
  //   FCM_KEY: 'AIzaSyBKBQAPnBDzNPSmv9s_co3ZONjhf4jWAMI',

  GOOGLE_CLIENT_ID:
    '368826235155-cg7nfnucojc0pev66g7sfsepg2ku78i9.apps.googleusercontent.com',
  GOOGLE_CLIENT_SERECT: 'hCjmym-nlWvem9FDixMZvB5J',
  //   GOOGLE_CALLBACK_AUTH: 'api/auth/google/callback',

  debug_name: 'temp',

  //   // FACEBOOKCONSTANT
  //   facebook_api_key: '1944369115777550',
  //   facebook_api_secret: '23fdd1ed162334c94156075e9d9fda4d',

  uploads_folder_name: uploadsFolderName,
  uploads_folder: rootFolder + '/static/' + uploadsFolderName,
  admin_upload_folder: rootFolder + '/static/' + adminUploads,
  base_url: isLocal ? domain + ':' + port + '/' : domain + '/',
  setting: {
    mailto: { key: 'mail_to', value: 'contact@pdteam.net' },
    languagesTranslated: { key: 'languages_translated', value: ['en'] },
    languageDefault: { key: 'language_default', value: 'en' },
  },
  setting_publics: ['mail_to'],
  carAttr: {
    passenger_quantity: {
      key: 'passenger_quantity',
      values: ['2', '3', '4', 'more'],
    },
    car_group: {
      key: 'car_group',
      values: [
        'economy',
        'compact',
        'midsize',
        'stabdart',
        'fullsize',
        'premium',
        'minivan',
        'crossover',
        'suv',
      ],
    },
    transmission: {
      key: 'transmission',
      values: ['automatic', 'manual'],
    },
    engine: {
      key: 'engine',
      values: ['gas', 'diesel', 'hybird', 'electric'],
    },
    equipment: {
      key: 'equipment',
      values: [
        'climate_control',
        'air_conditioning',
        'satellite_navigation',
        'power_door_lock',
        'fm_radio',
        'stereo_mp3',
        'titt_steering_wheel',
        'power_window',
      ],
    },
    pickup_option: {
      key: 'pickup_option',
      values: [
        'terminal_pickup',
        'shuttle_bus_to_car',
        'meet_and_greet',
        'car_with_driver',
      ],
    },
  },
};
