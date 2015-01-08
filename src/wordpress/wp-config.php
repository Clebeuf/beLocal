<?php
/**
 * The base configurations of the WordPress.
 *
 * This file has the following configurations: MySQL settings, Table Prefix,
 * Secret Keys, and ABSPATH. You can find more information by visiting
 * {@link http://codex.wordpress.org/Editing_wp-config.php Editing wp-config.php}
 * Codex page. You can get the MySQL settings from your web host.
 *
 * This file is used by the wp-config.php creation script during the
 * installation. You don't have to use the web site, you can just copy this file
 * to "wp-config.php" and fill in the values.
 *
 * @package WordPress
 */

// ** MySQL settings - You can get this info from your web host ** //
/** The name of the database for WordPress */
define('DB_NAME', 'wordpress');

/** MySQL database username */
define('DB_USER', 'wordpress');

/** MySQL database password */
define('DB_PASSWORD', 'wordpress');

/** MySQL hostname */
define('DB_HOST', 'localhost');

/** Database Charset to use in creating database tables. */
define('DB_CHARSET', 'utf8');

/** The Database Collate type. Don't change this if in doubt. */
define('DB_COLLATE', '');

/**#@+
 * Authentication Unique Keys and Salts.
 *
 * Change these to different unique phrases!
 * You can generate these using the {@link https://api.wordpress.org/secret-key/1.1/salt/ WordPress.org secret-key service}
 * You can change these at any point in time to invalidate all existing cookies. This will force all users to have to log in again.
 *
 * @since 2.6.0
 */
define('AUTH_KEY',         '<u2|jd~Cs(-wv|AcI)e#ZSHTRYQk@te{cs.t~_=wYanlX|YTU{&`g~D/Yr|*Kw0@');
define('SECURE_AUTH_KEY',  '<zh9zS5_yZ DN<b[:F*pn#yfQon(A.d6*;Jq`<3H#kySB.?h q]%Dlxq1|+pP`zd');
define('LOGGED_IN_KEY',    '0bqLT!>i?rAD40: rCEJ7-aJm.+|8?ldIx|#)mq!u!+h<Peh|/-&<+z-eP2+u9g*');
define('NONCE_KEY',        'uG,:b!rb+uB=PaH-qsQ&^?Vp_#,d]1FtOO LS(VZx,/7gz>V|hkpq+O=mq-3A 1u');
define('AUTH_SALT',        'Ia8y]wQN=J0$V8n|;7g+ITtw0-BC:DaiSd,Pv*4*^K;;nkzC3Bgdk#0T_[5(az}g');
define('SECURE_AUTH_SALT', 'B~-|Ad<FbBo+UmLJ40lJgr5~y.[#,$@V|+*.z-4^C/p-Vc^tT&v,E8.$M(/WN!?$');
define('LOGGED_IN_SALT',   'RnQ)-*&L<JP%Uw#B`{[ee_5n.,$]HR2-lLx4PNQwc|WX:7p35<0Tu*+fqV+JmTEY');
define('NONCE_SALT',       '%6)+Zrgre27mbx,Lt:eILN-ORv.kz]~u~T5=53q{+iBzeKXwi$LS{zw@e%f9+2ZZ');

/**#@-*/

/**
 * WordPress Database Table prefix.
 *
 * You can have multiple installations in one database if you give each a unique
 * prefix. Only numbers, letters, and underscores please!
 */
$table_prefix  = 'wp_';

/**
 * For developers: WordPress debugging mode.
 *
 * Change this to true to enable the display of notices during development.
 * It is strongly recommended that plugin and theme developers use WP_DEBUG
 * in their development environments.
 */
define('WP_DEBUG', false);
define('FS_METHOD', 'direct');  //for automatic plugin installation
/* That's all, stop editing! Happy blogging. */

/** Absolute path to the WordPress directory. */
if ( !defined('ABSPATH') )
	define('ABSPATH', dirname(__FILE__) . '/');

/** Sets up WordPress vars and included files. */
require_once(ABSPATH . 'wp-settings.php');
