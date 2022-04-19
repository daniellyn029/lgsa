<?php
    require_once('../utils.php');
   
    $date = SysDate();
    $time = SysTime();


    $data = array( 
        "duty"                => array("ddo_employee"=>array(),"ddo_place_of_duty"=>array(),"ddo_firearms_issued"=>array())
    );

$return = json_encode($data);
print $return;







?>