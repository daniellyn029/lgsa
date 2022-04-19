<?php
    require_once('../utils.php');
    require_once('../function/getData.php');

    $param = json_decode(file_get_contents('php://input'));
   
    $date = SysDate();
    $time = SysTime();


    $data = array( 
        "voucher_employee"       => '',
        "prepared_by_employee_id"=> $param->accountuserid,
        "prepared_by_employee_name" => getAccountName($con, $param->accountuserid),
        "voucher_date"           => $date,
        // "voucher_control_no"     => '',
        "voucher_address"        => '',
        "voucher_contact_no"     => '',
        "voucher_total"          => '',
        "voucher"                => array("particulars"=>array(),"amount"=>array())

    
    );

$return = json_encode($data);
print $return;







?>