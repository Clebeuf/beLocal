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
define('DB_USER', 'wordpress_user');

/** MySQL database password */
define('DB_PASSWORD', 'belocal_wordpress');

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
define('AUTH_KEY',         '4H{s;? 4 cIi`*aw_,[(A,G>_s{6=6T2Q6=Lt!reQ&x,+4iL*Bz4y&zGFM[@(kmW');
define('SECURE_AUTH_KEY',  'e-)|XcbnvyIFoQyOYq~msv3>cL9+ ry|,-&GfAW)m-B^ZjQK+7){bON|mwTU?b;r');
define('LOGGED_IN_KEY',    'A`$W__ue!%^NI>;I(t_qPZ|-$5?z$^!D@vu&a2-zB3 MQQqU[hd+gl^=@890Rm;V');
define('NONCE_KEY',        '#Yrcr~Jp^k2H%6}M5Vn)jH 6D0O*m.b<=d`-s 9;e@Y`sbmWEwn^3FBjPY2WM2d(');
define('AUTH_SALT',        '*XidoKKJ!(xo+vQb9_|=/c$Z77,N|TO6Yr2+>a~/l1$br`pT-sJ C+QFM#STE $O');
define('SECURE_AUTH_SALT', '}wsHByP+-rNNVq%z%`)Jw.X]$-?s)%@Sw^JKn%-ry?i>[Yj_FHSC8Mx1%[PGl|3u');
define('LOGGED_IN_SALT',   '__fh7~q!lG+9qFpF}jU7stCj,Uv9XA=A{PZ2cjFp=&-!$aTxt(b^3.L.wR-cB32F');
define('NONCE_SALT',       '6pEfG*I60=`[[[6 ,0JfQ:q+R:H+Tc-+ 5{:(wvoKq.V4>Ew+[@m,-{+Qr|0c`e>');

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

define('FS_METHOD', 'direct');  // for automatic plugin installation

/* That's all, stop editing! Happy blogging. */

/** Absolute path to the WordPress directory. */
if ( !defined('ABSPATH') )
	define('ABSPATH', dirname(__FILE__) . '/');

/** Sets up WordPress vars and included files. */
require_once(ABSPATH . 'wp-settings.php');
