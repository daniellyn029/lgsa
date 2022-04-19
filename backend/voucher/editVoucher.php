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



//Check if already logged in
if( !empty($param->accountuserid)){
    if( !empty($param->edit_voucher_employee_name)){
        if( !empty($param->edit_voucher_date)){
            

            // Update Database  
            $Qry_a            = new Query();
            $Qry_a->table     = "lgsa_voucher";
            $Qry_a->selected  = "lgsa_payee_full_name        ='".$param->edit_voucher_employee_name."',
                                    lgsa_payee_employee_id      ='".$param->edit_voucher_employee_id."',
                                    lgsa_voucher_date           ='".$param->edit_voucher_date."',
                                    lgsa_payee_address          ='".$param->edit_voucher_address."',
                                    lgsa_payee_contact_no       ='".$param->edit_voucher_contact_no."',
                                    lgsa_voucher_total          ='".$param->voucher_total_edit."'";

            $Qry_a->fields    = "lgsa_voucher_id='".$param->edit_voucher_id."'";

            $rs_a             = $Qry_a->_update($con);   
            
            if($rs_a){

                // DELETE Particulars and Amount
                $Qry_d                  = new Query();
                $Qry_d->table           = "lgsa_voucher_particulars";
                $Qry_d->selected        = "lgsa_control_no";
                $Qry_d->fields          = "lgsa_control_no='".$param->edit_voucher_control_no."'";
                $rs_d                   = $Qry_d->_delete($con);

                if($rs_d){
                    
                    // INSERT TO VOUCHER PARTICULARS
                    foreach( $param->particulars as $k=>$v ){
                        // if(!empty($param->particulars[$k]) && !empty($param->amount[$k])){

                            if(!empty($param->particulars[$k])){
                                if(!empty($param->amount[$k])){

                                    $Qry2            = new Query();
                                    $Qry2->table     = "lgsa_voucher_particulars";
                                    $Qry2->selected  = "lgsa_control_no,
                                                        lgsa_voucher_particulars,
                                                        lgsa_voucher_amount";
                                    $Qry2->fields    = "'".$param->edit_voucher_control_no."',
                                                        '".$param->particulars[$k]."',
                                                        '".$param->amount[$k]."'";
                                    $checkParts      = $Qry2->_insert($con);
                                    
                                }else{
                                    $return = json_encode(array("status"=>"noamo"));
                                    print $return;
                                    mysqli_close($con);
                                    return;
                                }
                            }else{
                                $return = json_encode(array("status"=>"nopar"));
                                print $return;
                                mysqli_close($con);
                                return;
                            }

                        // }else{
                        //     $return =  json_encode(array('status'=>'noparamo',mysqli_error($con)));
                        //     print $return;
                        //     mysqli_close($con);
                        //     return;
                        // }
                        
                    }

                    $return = json_encode(array("status"=>"success"));


                }else{
                    $return = json_encode(array('status'=>'error','delete','lgsa_voucher_particulars', mysqli_error($con)));
                }


            }else{
                $return = json_encode(array('status'=>'error','insert','sa', mysqli_error($con)));
            }
            
        }else{
            $return = json_encode(array("status"=>"nodat"));
        }
    }else{
        $return = json_encode(array("status"=>"noemp"));
    }

}else{
    $return = json_encode(array("status"=>"notloggedin"));
}






print $return;
mysqli_close($con);


?>