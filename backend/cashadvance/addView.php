<?php
    require_once('../utils.php');
    require_once('../function/getData.php');

    $param = json_decode(file_get_contents('php://input'));
    $date = SysDate();
    $time = SysTime();

    $data = array(     
       
        "add_cashadvance_client_name"   => '',
        "add_prepared_by_id"            => $param->accountuserid,
        "add_prepared_by_name"          => getAccountName($con, $param->accountuserid),
        "cashadvance_date"              => $date,
        "cashadvance_control_no"        => '',
        "cashadvance_total"             => '',
        "cashadvance"                   => array("employee"=>array(),"amount"=>array())
    );


$return = json_encode($data);
print $return;

?>