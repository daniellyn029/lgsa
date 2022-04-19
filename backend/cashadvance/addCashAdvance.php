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



//Check if already logged in
if( !empty($param->accountuserid)){
    if( !empty($param->add_cashadvance_client_id)){
        if( !empty($param->cashadvance_date)){



            // Generate unique ticket number
            $linkid = getCount($con, 'cash_advance', 'lgsa_count');
            $cash_advance_control_no = $year_date_explode.'-CA'.str_pad($linkid,6,"0",STR_PAD_LEFT);


            // Filter for CashAdvance 
            $cash_advance = array();
            $var = 0;
            foreach($param->info->cashadvance->employee as $key => $value){
                if(!empty($param->info->cashadvance->employee[$key]) || !empty($param->info->cashadvance->amount[$key])){
                    array_push($cash_advance,$key);
                    $var++;
                }
            }
            //No input name and amount
            if($var == 0){
                $return = json_encode(array('status'=>'noempamo'));
                print $return;
                mysqli_close($con);
                return;
            }
            foreach($cash_advance as $val){

                // Name Empty
                if(empty($param->info->cashadvance->employee[$val])){
                    $return = json_encode(array('status'=>'noemp'));
                    print $return;
                    mysqli_close($con);
                    return;
                }

                // Amount 
                if(empty($param->info->cashadvance->amount[$val])){
                    $return = json_encode(array('status'=>'noamo'));
                    print $return;
                    mysqli_close($con);
                    return;
                }                                                      

            }


            foreach($cash_advance as $val1){
                $param->info->cashadvance->employee       =   (str_replace("'","",$param->info->cashadvance->employee ));
                $param->info->cashadvance->amount            =   (str_replace("'","",$param->info->cashadvance->amount ));
            }





            $Qry            = new Query();  
            $Qry->table     = "lgsa_cash_advance";
            $Qry->selected  = "lgsa_cash_advance_client_id,
                            lgsa_cash_advance_client_name,
                            lgsa_cash_advance_date,
                            lgsa_cash_advance_control_no,
                            lgsa_cash_advance_total,
                            lgsa_cash_advance_requested_by_employee_id,
                            lgsa_cash_advance_requested_by_name,
                            lgsa_cash_advance_status,
                            is_created";
            $Qry->fields    = "'".$param->add_cashadvance_client_id."',
                            '".getClientName($con, $param->add_cashadvance_client_id)."',
                            '".$param->cashadvance_date."',
                            '".$cash_advance_control_no."',
                            '".$param->cashadvance_total."',
                            '".$param->add_prepared_by_id."',
                            '".$param->add_prepared_by_name."',
                            'Pending',
                            '".$datetime."'";

            $checke           = $Qry->_insert($con);

            if($checke){


                // INSERT TO CASHADVANCE NAME
                foreach($cash_advance as $val2){


                    $Qry2            = new Query();
                    $Qry2->table     = "lgsa_cashadvance_employee_name";
                    $Qry2->selected  = "lgsa_cashadvance_control_no,
                                        lgsa_cashadvance_employee_id,
                                        lgsa_cashadvance_name,
                                        lgsa_cashadvance_employee_amount";
                    $Qry2->fields    = "'".$cash_advance_control_no."',
                                        '".$param->info->cashadvance->employee[$val2]."',
                                        '".getEmployeeName($con, $param->info->cashadvance->employee[$val2])."',
                                        '".$param->info->cashadvance->amount[$val2]."'";
                    $checkParts      = $Qry2->_insert($con);
                    if(!$checkParts){
                        $return =  json_encode(array('status'=>'noentrytable',mysqli_error($con)));
                        print $return;
                        mysqli_close($con);
                        return;
                    }                                                            
                }


                // Update cashadvance counter 
                $Qry_u = new Query();
                $Qry_u->table = "lgsa_count";
                $Qry_u->selected = "lgsa_count_counter='".getCount($con, 'cash_advance', 'lgsa_count')."'";
                $Qry_u->fields = "lgsa_count_control_name='cash_advance'";
                $rs_u=$Qry_u->_update($con);
                if($rs_u){
                    $return = json_encode(array("status"=>"success"));
                }else{
                    $return = json_encode(array('status'=>'error','insert','lgsa_count', mysqli_error($con)));
                }

            }else{
                $return = json_encode(array('status'=>'error','insert','lgsa_cash_advance', mysqli_error($con)));
            }

        }else{
            $return = json_encode(array("status"=>"nodat"));
        }
    }else{
        $return = json_encode(array("status"=>"nocli"));
    }

}else{
    $return = json_encode(array("status"=>"notloggedin"));
}

     
print $return;
mysqli_close($con);

?>