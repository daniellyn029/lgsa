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

// Explode of System Date
$tmp_now = strtotime($date);
$date_time = explode('-',$date);
$year_date_explode = $date_time[0];
$return ='';


//Check if already logged in
if( !empty($param->accountuserid)){
    if(!empty($param->add_voucher_employee_name)){
        if(!empty($param->voucher_date)){


            // Generate unique ticket number
            $linkid = getCount($con, 'voucher', 'lgsa_count');
            $voucher_control_no = $year_date_explode.'-VC'.str_pad($linkid,6,"0",STR_PAD_LEFT);

            // Filter for Voucher 
            $voucher = array();
            $var = 0;
            foreach($param->info->voucher->particulars as $key => $value){
                if(!empty($param->info->voucher->particulars[$key]) || !empty($param->info->voucher->amount[$key])){
                    array_push($voucher,$key);
                    $var++;
                }
            }
            //No input particulars and amount
            if($var == 0){
                $return = json_encode(array('status'=>'noparamo'));
                print $return;
                mysqli_close($con);
                return;
            }
            foreach($voucher as $val){

                // Particulars Empty
                if(empty($param->info->voucher->particulars[$val])){
                    $return = json_encode(array('status'=>'nopar'));
                    print $return;
                    mysqli_close($con);
                    return;
                }

                // Amount Empty
                if(empty($param->info->voucher->amount[$val])){
                    $return = json_encode(array('status'=>'noamo'));
                    print $return;
                    mysqli_close($con);
                    return;
                }                                                      

            }


            foreach($voucher as $val1){
                $param->info->voucher->particulars       =   (str_replace("'","",$param->info->voucher->particulars ));
                $param->info->voucher->amount            =   (str_replace("'","",$param->info->voucher->amount ));
            }

            $Qry            = new Query();  
            $Qry->table     = "lgsa_voucher";
            $Qry->selected  = "lgsa_payee_employee_id,
                            lgsa_payee_full_name,
                            lgsa_voucher_date,
                            lgsa_control_no,
                            lgsa_payee_address,
                            lgsa_payee_contact_no,
                            lgsa_voucher_prepared_by_employee_id,
                            lgsa_voucher_prepared_by_name,
                            lgsa_voucher_total,
                            lgsa_voucher_status,
                            is_created";
            $Qry->fields    = "'".$param->add_voucher_employee_id."',
                            '".$param->add_voucher_employee_name."',
                            '".$param->voucher_date."',
                            '".$voucher_control_no."',
                            '".$param->add_voucher_address."',
                            '".$param->add_voucher_contact_no."',
                            '".$param->prepared_by_employee_id."',
                            '".$param->prepared_by_employee_name."',
                            '".$param->voucher_total."',
                            'Pending',
                            '".$datetime."'";

            $checke           = $Qry->_insert($con);

            if($checke){

                // INSERT TO VOUCHER PARTICULARS
                foreach($voucher as $val2){


                    $Qry2            = new Query();
                    $Qry2->table     = "lgsa_voucher_particulars";
                    $Qry2->selected  = "lgsa_control_no,
                                        lgsa_voucher_particulars,
                                        lgsa_voucher_amount";
                    $Qry2->fields    = "'".$voucher_control_no."',
                                        '".$param->info->voucher->particulars[$val2]."',
                                        '".$param->info->voucher->amount[$val2]."'";
                    $checkParts      = $Qry2->_insert($con);
                    // if(!$checkParts){
                    //     $return =  json_encode(array('status'=>'noentrytable',mysqli_error($con)));
                    //     print $return;
                    //     mysql_close($con);
                    //     return;
                    // }                                                            
                }

                //Update voucher counter 
                $Qry_u = new Query();
                $Qry_u->table = "lgsa_count";
                $Qry_u->selected = "lgsa_count_counter='".getCount($con, 'voucher', 'lgsa_count')."'";
                $Qry_u->fields = "lgsa_count_control_name='voucher'";
                $rs_u=$Qry_u->_update($con);
                if($rs_u){
                    $return = json_encode(array("status"=>"success"));
                }else{
                    $return = json_encode(array('status'=>'error','insert','lgsa_count', mysqli_error($con)));
                }
                
            }else{
                $return = json_encode(array('status'=>'error','insert','lgsa_voucher', mysqli_error($con)));
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