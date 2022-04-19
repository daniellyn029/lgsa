<?php 

require_once('../database.php');
require_once('../utils.php');
$conn = new connector();
$con = $conn->connect();


$param = json_decode(file_get_contents('php://input'));

$date = SysDate();
$time = SysTime();

    //Check if already logged in
    if( !empty($param->accountuserid) ){

        // Select
        $Qry                        = new Query();
        $Qry->table                 = "lgsa_client";
        $Qry->selected              = "*";
        $Qry->fields                = "lgsa_client_id='".$param->client_id."'";
        $rs                         = $Qry->_select($con);	
        if(mysqli_num_rows($rs)>=1){
            while($row=mysqli_fetch_array($rs)){
                $data = array( 
                    
                    'company_id'                                            =>$row['lgsa_client_id'],
                    'company_name'         	                                =>$row['lgsa_client_business_name'],
                    'status'        	                                    =>$row['lgsa_client_status'],
                    'contact_person'                                        =>$row['lgsa_client_contact_person'],
                    'contact_no'     	                                    =>$row['lgsa_client_tel_num'],
                    'email'           	                                    =>$row['lgsa_client_email'],
                    'company_address'                                       =>$row['lgsa_client_business_add'],

                    'working_hours'                                         =>$row['lgsa_client_working_hours'],
                    'minimum_daily_rate'                                    =>$row['lgsa_client_minimum_daily_rate'],
                    '_5_days_incentive'                                     =>$row['lgsa_client_5_days_incentive'],
                    '_13th_month_pay'                                       =>$row['lgsa_client_13th_month_pay'],
                    'retirement_benefits'                                   =>$row['lgsa_client_retirement_benefits'],
                    'uniform_allowance'                                     =>$row['lgsa_client_uniform_allowance'],
                    'overtime'                                              =>$row['lgsa_client_overtime'],
                    'night_differential'                                    =>$row['lgsa_client_night_differential'],
                    'sss'                                                   =>$row['lgsa_client_sss'],
                    'philhealth'                                            =>$row['lgsa_client_philhealth'],
                    'pagibig'                                               =>$row['lgsa_client_pagibig'],
                    'others'                                                =>$row['lgsa_client_others']

                );
            } 
            $return = json_encode($data);
        }
    }else{
        $return = json_encode(array("status"=>"notloggedin"));
    }

print $return;
mysqli_close($con);



?>