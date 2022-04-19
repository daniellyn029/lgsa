<?php
require_once('../database.php');
require_once('../utils.php');
require_once('../function/getData.php');

$conn = new connector();
$con = $conn->connect();

$param = json_decode(file_get_contents('php://input'));
$date = SysDate();
$time = SysTime();
$datetime = $date.' '.$time;
$return = '';

// Explode of System Date
$tmp_now = strtotime($date);
$date_time = explode('-',$date);
$year_date_explode = $date_time[0];


    // Generate unique ticket number
    $linkid = getCount($con, 'billing', 'lgsa_count');
    $billing_control_no = $year_date_explode.'-BIL'.str_pad($linkid,6,"0",STR_PAD_LEFT);



//Check if already logged in
if(!empty($param->accountuserid)){
    // if(!empty($param['add_client_no'])){
        if(!empty($param->add_client_name)){
            if(!empty($param->add_date_issued)){
                if(!empty($param->add_address)){
                    if(!empty($param->add_cp)){
                        if(!empty($param->add_amount)){
                            if(!empty($param->add_particulars)){
                            

                                //clean string
                                $param->add_client_name_id             = (str_replace("'","",$param->add_client_name_id));
                                $param->add_client_name                = (str_replace("'","",$param->add_client_name));
                                $param->add_address                    = (str_replace("'","",$param->add_address));
                                $param->add_date_issued                = (str_replace("'","",$param->add_date_issued));
                                $param->add_cp                         = (str_replace("'","",$param->add_cp));
                                $param->add_amount                     = (str_replace("'","",$param->add_amount));
                                $param->add_particulars                = (str_replace("'","",$param->add_particulars));
                                $param->add_prepared_by_employee_id    = (str_replace("'","",$param->add_prepared_by_employee_id));
                                $param->add_prepared_by_employee_name  = (str_replace("'","",$param->add_prepared_by_employee_name));



                                $Qry            = new Query();  
                                $Qry->table     = "lgsa_billing";
                                $Qry->selected  = "lgsa_billing_client_id,
                                                    lgsa_billing_client_name,
                                                    lgsa_billing_client_address,
                                                    lgsa_billing_date_issued,
                                                    lgsa_billing_control_id,
                                                    lgsa_billing_contact_number,
                                                    lgsa_billing_amount,
                                                    lgsa_billing_particulars,
                                                    lgsa_billing_prepared_by_employee_id,
                                                    lgsa_billing_prepared_by_employee_name,
                                                    lgsa_billing_status,                       
                                                    is_created";
                                                
                                $Qry->fields    = "'".$param->add_client_name_id."',
                                                   '".$param->add_client_name."',
                                                   '".$param->add_address."',
                                                   '".$param->add_date_issued."',
                                                   '".$billing_control_no."',
                                                   '".$param->add_cp."',
                                                   '".$param->add_amount."',
                                                   '".$param->add_particulars."',
                                                   '".$param->add_prepared_by_employee_id."',
                                                   '".$param->add_prepared_by_employee_name."',
                                                   'Pending', 
                                                   '".$datetime."'";

                                $checke         = $Qry->_insert($con);

                                if($checke){

                                    //Insert to Collectibles
                                    $Qry            = new Query();
                                    $Qry->table     = "lgsa_collectible";
                                    $Qry->selected  = "lgsa_client_id,
                                                       lgsa_collectible_client_name,
                                                       lgsa_collectible_date_issued,
                                                       lgsa_collectible_total,
                                                       lgsa_collectible_status";
                                    $Qry->fields    = "'".$param->add_client_name_id."',
                                                        '".$param->add_client_name."',
                                                        '".$param->add_date_issued."',
                                                        '".$param->add_amount."',
                                                        'Collectible'";
                                    $rs      		= $Qry->_insert($con);

                                    if($rs){

                                        // Update billing    
                                        $Qry_u = new Query();
                                        $Qry_u->table = "lgsa_count";
                                        $Qry_u->selected = "lgsa_count_counter='".getCount($con, 'billing', 'lgsa_count')."'";
                                        $Qry_u->fields = "lgsa_count_control_name='billing'";
                                        $rs_u=$Qry_u->_update($con);

                                        if($rs_u){
                                            $return = json_encode(array("status"=>"success"));
                                        }else{
                                            $return = json_encode(array('status'=>'error','insert','lgsa_count', mysqli_error($con)));
                                        }

                                    }else{
                                        $return = json_encode(array('status'=>'error','insert','lgsa_collectible', mysqli_error($con)));
                                    }
                                }else{
                                    $return = json_encode(array('status'=>'error','insert','lgsa_billing', mysqli_error($con)));
                                }
                            }else{
                                $return = json_encode(array("status"=>"nopar"));
                            }
                        }else{
                            $return = json_encode(array("status"=>"noamo"));
                        }
                    }else{
                        $return = json_encode(array("status"=>"nocp"));
                    }
                }else{
                    $return = json_encode(array("status"=>"noadd"));
                }
            }else{
                $return = json_encode(array("status"=>"nodatiss"));
            }
        }else{
            $return = json_encode(array("status"=>"nonam"));
        }
    // }else{
    //     $return = json_encode(array("status"=>"nono"));
    // }
}else{
    $return = json_encode(array("status"=>"notloggedin"));
}


          
print $return;
mysqli_close($con);

?>