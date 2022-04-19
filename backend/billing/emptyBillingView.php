<?php
require_once('../database.php');
require_once('../utils.php');
require_once('../function/getData.php');
$conn = new connector();
$con = $conn->connect();

$param = json_decode(file_get_contents('php://input'));
$date = SysDate();
$time = SysTime();

    $data = array(     

        "add_client_name_id"                 => '',
        "add_client_name"                    => '',
        "add_date_issued"                    => $date,
        "add_address"                        => '',
        "add_cp"                             => '',
        "add_amount"                         => '',
        "add_particulars"                    => '',
        "add_prepared_by_employee_id"        => $param->accountuserid,
        "add_prepared_by_employee_name"      => getAccountName($con, $param->accountuserid),

    );

    $return = json_encode($data);


print $return;


?>