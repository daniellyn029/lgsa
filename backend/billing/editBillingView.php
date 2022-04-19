<?php
require_once('../database.php');
require_once('../utils.php');
require_once('../function/password.php');
$conn = new connector();    
$con = $conn->connect();


$param = json_decode(file_get_contents('php://input'));
$date=SysDate();
$time=SysTime();


//Check if already logged in
if(!empty($param->accountuserid)){
    // if(!empty($param['add_client_no'])){
        if(!empty($param->edit_client_name)){
            if(!empty($param->edit_date_issued)){
                if(!empty($param->edit_address)){
                    if(!empty($param->edit_cp)){
                        if(!empty($param->edit_amount)){
                            if(!empty($param->edit_particulars)){
                            

                               //clean string
                               $param->edit_client_name_id             = (str_replace("'","",$param->edit_client_name_id));
                               $param->edit_client_name                = (str_replace("'","",$param->edit_client_name));
                               $param->edit_address                    = (str_replace("'","",$param->edit_address));
                               $param->edit_date_issued                = (str_replace("'","",$param->edit_date_issued));
                               $param->edit_cp                         = (str_replace("'","",$param->edit_cp));
                               $param->edit_amount                     = (str_replace("'","",$param->edit_amount));
                               $param->edit_particulars                = (str_replace("'","",$param->edit_particulars));



                                $Qry            = new Query();  
                                $Qry->table     = "lgsa_billing";
                                $Qry->selected  = "lgsa_billing_client_id       = '".$param->edit_client_name_id."',
                                                   lgsa_billing_client_name     = '".$param->edit_client_name."',  
                                                   lgsa_billing_client_address  = '".$param->edit_address."', 
                                                   lgsa_billing_date_issued     = '".$param->edit_date_issued."', 
                                                   lgsa_billing_contact_number  = '".$param->edit_cp."', 
                                                   lgsa_billing_amount          = '".$param->edit_amount."',
                                                   lgsa_billing_particulars     = '".$param->edit_particulars."'";
                                                
                                $Qry->fields    = "lgsa_billing_id='".$param->edit_billing_id."'";
                                $checke         = $Qry->_update($con);

                                if($checke){

                                    $return = json_encode(array("status"=>"success"));
                               
                                }else{
                                    $return = json_encode(array("status"=>"error",mysqli_error($con)));
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