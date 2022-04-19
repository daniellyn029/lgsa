<?php
require_once('../database.php');
require_once('../utils.php');
$conn = new connector();
$con = $conn->connect();

// Encrypt
function encrypt($data){
	
    $key = '@gTSqK82GADBp.1';
    $method = 'AES-256-ECB';
    $ivSize = openssl_cipher_iv_length($method);
    $iv = openssl_random_pseudo_bytes($ivSize);
    
    $encrypted = openssl_encrypt($data, $method, $key, OPENSSL_RAW_DATA, $iv);
    // For storage/transmission, we simply concatenate the IV and cipher text
    $encrypted = base64_encode($iv . $encrypted);

    return $encrypted;

}

// Decrypt
function decrypt($data){
    
    $key = '@gTSqK82GADBp.1';
    $method = 'AES-256-ECB';
    $data = base64_decode($data);
    $ivSize = openssl_cipher_iv_length($method);
    $iv = substr($data, 0, $ivSize);

    $decrypted = openssl_decrypt(substr($data, $ivSize), $method, $key, OPENSSL_RAW_DATA, $iv);

    
    return $decrypted;
    
}

?>