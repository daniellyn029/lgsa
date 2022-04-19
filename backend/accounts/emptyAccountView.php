<?php
require_once('../database.php');
require_once('../utils.php');
$conn = new connector();
$con = $conn->connect();

$date = SysDate();
$time = SysTime();

    $data = array(     
        "add_prof_pic"		    => 'frontend/assets/images/profile_pic/user-icon.png?'.time(),
        "add_picFile"           => '',
        "add_employeeid123"    => '',
        "add_firstname"      => '',
        "add_middlename"    => '',
        "add_lastname"      => '',
        "add_suffix"        => '',
        "add_account_role"  => '',
        "add_email_status"  => '',
        "add_account_status"=> '',
        "add_email_address" => '',
        "add_cp"            => '',
        "add_address"       => '',
        "add_birthdate"     => '',
        "add_gender"        => '',

    );

    $return = json_encode($data);


print $return;


?>