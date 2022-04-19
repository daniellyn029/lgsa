<?php
require_once('../database.php');
require_once('../utils.php');
$conn = new connector();
$con = $conn->connect();

$date = SysDate();
$time = SysTime();

    $data = array(     
        "add_company_name"		        => '',
        "add_contact_person"            => '',
        "add_contact_no"                => '',
        "add_email"                     => '',
        "add_company_address"           => ''
    );

    $return = json_encode($data);

print $return;

?>