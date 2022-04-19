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
        if(!empty($param->company_name)){
            // Contact Person
            if(!empty($param->contact_person)){
                // Contact Number
                if(!empty($param->contact_no)){
                    // Email Address Validation
                    if((!filter_var($param->email, FILTER_VALIDATE_EMAIL) === false ) || (empty($param->email))){
                        // Daily Rate
                        if(!empty($param->daily_rate)){
                            // Address
                            if(!empty($param->company_address)){

                                // Check if client name already exists
                                if( checkClient( $con, $param->company_name ) ){ 
                                    $return = json_encode(array('status'=>'hasclient'));
                                    print $return;  
                                    mysqli_close($con);
                                    return;
                                }

                                // Insert
                                $Qry_a            = new Query();
                                $Qry_a->table     = "lgsa_client";
                                $Qry_a->selected  = "lgsa_client_business_name,
                                                     lgsa_client_contact_person,
                                                     lgsa_client_business_add,
                                                     lgsa_client_tel_num,
                                                     lgsa_client_email,
                                                     lgsa_client_rate,
                                                     lgsa_client_status,
                                                     is_created";
                                $Qry_a->fields    = "'".str_replace("'","",$param->company_name)."',
                                                     '".str_replace("'","",$param->contact_person)."',
                                                     '".str_replace("'","",$param->company_address)."',
                                                     '".str_replace("'","",$param->contact_no)."',
                                                     '".str_replace("'","",$param->email)."',
                                                     '".str_replace("'","",$param->daily_rate)."',
                                                     'Active',
                                                     '".$datetime."'";
                                $rs_a             = $Qry_a->_insert($con);
                                if($rs_a){

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
                                                         'addClient',
                                                         'clientsController',
                                                         'created',
                                                         '".$datetime."'";
                                    $rs_b             = $Qry_b->_insert($con);
                                    if($rs_b){
                                        $return = json_encode(array('status'=>'success'));
                                    }else{
                                        $return = json_encode(array('status'=>'error','insert','lgsa_user_log', mysqli_error($con)));
                                    }
                                    
                                }else{
                                    $return = json_encode(array('status'=>'error','insert','lgsa_client', mysqli_error($con)));
                                }

                            }else{
                                $return = json_encode(array("status"=>"noaddress"));
                            }
                        }else{
                            $return = json_encode(array("status"=>"nodailyrate"));
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