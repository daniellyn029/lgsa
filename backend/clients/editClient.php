<?php
require_once('../database.php');
require_once('../utils.php');
require_once('../function/checker.php');
$conn = new connector();
$con = $conn->connect();

$param = json_decode(file_get_contents('php://input'));
$date = SysDate();
$time = SysTime();
$datetime = $date.' '.$time;


    //Check if already logged in
    if( !empty($param->accountuserid) ){
        // Company Name
        if( !empty( $param->company_name) ){
            // Contact Person
            if(!empty($param->contact_person)){
                // Contact Number
                if(!empty($param->contact_no)){
                    // Email Address Validation
                    if((!filter_var($param->email, FILTER_VALIDATE_EMAIL) === false ) || (empty($param->email))){
                        // Address
                        if(!empty($param->company_address)){

                            // Check if client name already exists
                            // if( checkClient( $con, $param->company_name ) ){ 
                            //     $return = json_encode(array('status'=>'hasclient'));
                            //     print $return;  
                            //     mysqli_close($con);
                            //     return;
                            // }

                            // Update
                            $Qry_a            = new Query();
                            $Qry_a->table     = "lgsa_client";
                            $Qry_a->selected  = "lgsa_client_business_name='".str_replace("'","",$param->company_name)."',
                                                 lgsa_client_contact_person='".str_replace("'","",$param->contact_person)."',
                                                 lgsa_client_business_add='".str_replace("'","",$param->company_address)."',
                                                 lgsa_client_tel_num='".str_replace("'","",$param->contact_no)."',
                                                 lgsa_client_email='".str_replace("'","",$param->email)."',
 
                                                 lgsa_client_working_hours='".str_replace("'","",$param->working_hours)."',
                                                 lgsa_client_minimum_daily_rate='".str_replace("'","",$param->minimum_daily_rate)."',
                                                 lgsa_client_5_days_incentive='".str_replace("'","",$param->_5_days_incentive)."',
                                                 lgsa_client_13th_month_pay='".str_replace("'","",$param->_13th_month_pay)."',
                                                 lgsa_client_retirement_benefits='".str_replace("'","",$param->retirement_benefits)."',
                                                 lgsa_client_uniform_allowance='".str_replace("'","",$param->uniform_allowance)."',
                                                 lgsa_client_overtime='".str_replace("'","",$param->overtime)."',
                                                 lgsa_client_night_differential='".str_replace("'","",$param->night_differential)."',
                                                 lgsa_client_sss='".str_replace("'","",$param->sss)."',
                                                 lgsa_client_philhealth='".str_replace("'","",$param->philhealth)."',
                                                 lgsa_client_pagibig='".str_replace("'","",$param->pagibig)."',
                                                 lgsa_client_others='".str_replace("'","",$param->others)."',
 
                                                 lgsa_client_status='".$param->status."'";
                            $Qry_a->fields    = "lgsa_client_id='".$param->company_id."'";
                            $rs_a             = $Qry_a->_update($con);                  
                            if($rs_a){

                                if(($param->prev_company_name != $param->company_name) ||
                                    ($param->prev_status != $param->status) ||
                                    ($param->prev_contact_person != $param->contact_person) ||  
                                    ($param->prev_contact_no != $param->contact_no) || 
                                    ($param->prev_contact_no != $param->contact_no) ||
                                    ($param->prev_email != $param->email) ||
                                    ($param->prev_company_address != $param->company_address) ||
                                    ($param->prev_working_hours != $param->working_hours) ||
                                    ($param->prev_minimum_daily_rate != $param->minimum_daily_rate) ||
                                    ($param->prev_5_days_incentive != $param->_5_days_incentive) ||
                                    ($param->prev_13th_month_pay != $param->_13th_month_pay) ||
                                    ($param->prev_retirement_benefits != $param->retirement_benefits) ||
                                    ($param->prev_uniform_allowance != $param->uniform_allowance) ||
                                    ($param->prev_overtime != $param->overtime) ||
                                    ($param->prev_night_differential != $param->night_differential) ||
                                    ($param->prev_sss != $param->sss) || 
                                    ($param->prev_philhealth != $param->philhealth) ||
                                    ($param->prev_pagibig != $param->pagibig) ||
                                    ($param->prev_others != $param->others) ){

                                    // Insert to User Logs
                                    $Qry_b            = new Query();
                                    $Qry_b->table     = "lgsa_user_log";
                                    $Qry_b->selected  = "lgsa_user_employee_id,
                                                         lgsa_user_log_user_account,
                                                         lgsa_user_log_function,
                                                         lgsa_user_log_module,
                                                         lgsa_user_log_action,
                                                         lgsa_user_log_date_time";
                                    $Qry_b->fields    = "'".$param->accountuserid."',
                                                         '".$param->accounttype."',
                                                         'editClient',
                                                         'clientsController',
                                                         'updated',
                                                         '".$datetime."'";
                                    $rs_b             = $Qry_b->_insert($con);
                                    if($rs_b){
                                        $return = json_encode(array('status'=>'success','edited'));
                                    }else{
                                        $return = json_encode(array('status'=>'error','insert','lgsa_user_log', mysqli_error($con)));
                                    }
                                }else{
                                    $return = json_encode(array('status'=>'success','notedited'));
                                }
                                

                            }else{
                                $return = json_encode(array('status'=>'error','update','lgsa_client', mysqli_error($con)));
                            }

                        }else{
                            $return = json_encode(array("status"=>"noaddress"));
                        }
                    }else{
                        $return = json_encode(array("status"=>"invalidemail"));
                    }
                }else{
                    $return = json_encode(array("status"=>"nocontact"));
                }
            }else{
                $return = json_encode(array("status"=>"nocontactperson"));
            }
        }else{
            $return = json_encode(array("status"=>"nocompanyname"));
        }

    }else{
        $return = json_encode(array("status"=>"notloggedin"));
    }


print $return;
mysqli_close($con);




?>