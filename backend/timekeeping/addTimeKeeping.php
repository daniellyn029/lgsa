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
$proceed = 0;

    //Check if already logged in
    if( !empty($param->accountuserid) ){
        if( !empty($param->info->establishment) ){
            if( !empty($param->info->period_covered_from) ){
                if( !empty($param->info->period_covered_to) ){
                    if( $param->info->period_covered_from < $param->info->period_covered_to ){

                        // Filter for Timekeeping
                        $tk = array();
                        foreach($param->info->tk->employee_id as $keys=>$valz){
                            $txt = 0;
                            if(empty($param->info->tk->employee_id[$keys]) ){
                                $txt++;
                            }
                            if($param->info->tk->day_one[$keys] == ""){
                                $txt++;
                            }
                            // if($param->info->tk->day_two[$keys] == ""){
                            //     $txt++;
                            // }
                            // if($param->info->tk->day_three[$keys] == ""){
                            //     $txt++;
                            // }
                            // if($param->info->tk->day_four[$keys] == ""){
                            //     $txt++;
                            // }
                            // if($param->info->tk->day_five[$keys] == ""){
                            //     $txt++;
                            // }
                            // if($param->info->tk->day_six[$keys] == ""){
                            //     $txt++;
                            // }
                            // if($param->info->tk->day_seven[$keys] == ""){
                            //     $txt++;
                            // }
                            // if($param->info->tk->day_eight[$keys] == ""){
                            //     $txt++;
                            // }
                            // if($param->info->tk->day_nine[$keys] == ""){
                            //     $txt++;
                            // }
                            // if($param->info->tk->day_ten[$keys] == ""){
                            //     $txt++;
                            // }
                            // if($param->info->tk->day_eleven[$keys] == ""){
                            //     $txt++;
                            // }
                            // if($param->info->tk->day_twelve[$keys] == ""){
                            //     $txt++;
                            // }
                            // if($param->info->tk->day_thirteen[$keys] == ""){
                            //     $txt++;
                            // }
                            // if($param->info->tk->day_fourteen[$keys] == ""){
                            //     $txt++;
                            // }
                            // if($param->info->tk->day_fifteen[$keys] == ""){
                            //     $txt++;
                            // }
                            // if($param->info->tk->first_row_overtime[$keys] == ""){
                            //     $txt++;
                            // }
                            // if($param->info->tk->first_row_hours[$keys] == ""){
                            //     $txt++;
                            // }
                            // if($param->info->tk->first_row_no_of_days[$keys] == ""){
                            //     $txt++;
                            // }
                            // if($param->info->tk->day_sixteen[$keys] == ""){
                            //     $txt++;
                            // }
                            // if($param->info->tk->day_seventeen[$keys] == ""){
                            //     $txt++;
                            // }
                            // if($param->info->tk->day_eighteen[$keys] == ""){
                            //     $txt++;
                            // }
                            // if($param->info->tk->day_nineteen[$keys] == ""){
                            //     $txt++;
                            // }
                            // if($param->info->tk->day_twenty[$keys] == ""){
                            //     $txt++;
                            // }
                            // if($param->info->tk->day_twenty_one[$keys] == ""){
                            //     $txt++;
                            // }
                            // if($param->info->tk->day_twenty_two[$keys] == ""){
                            //     $txt++;
                            // }
                            // if($param->info->tk->day_twenty_three[$keys] == ""){
                            //     $txt++;
                            // }
                            // if($param->info->tk->day_twenty_four[$keys] == ""){
                            //     $txt++;
                            // }
                            // if($param->info->tk->day_twenty_five[$keys] == ""){
                            //     $txt++;
                            // }
                            // if($param->info->tk->day_twenty_six[$keys] == ""){
                            //     $txt++;
                            // }
                            // if($param->info->tk->day_twenty_seven[$keys] == ""){
                            //     $txt++;
                            // }
                            // if($param->info->tk->day_twenty_eight[$keys] == ""){
                            //     $txt++;
                            // }
                            // if($param->info->tk->day_twenty_nine[$keys] == ""){
                            //     $txt++;
                            // }
                            // if($param->info->tk->day_thirty[$keys] == ""){
                            //     $txt++;
                            // }
                            // if($param->info->tk->day_thirty_one[$keys] == ""){
                            //     $txt++;
                            // }
                            // if($param->info->tk->day_overtime2[$keys] == ""){
                            //     $txt++;
                            // }
                            // if($param->info->tk->second_row_hours[$keys] == ""){
                            //     $txt++;
                            // }
                            // if($param->info->tk->second_row_days[$keys] == ""){
                            //     $txt++;
                            // }
                            // if($param->info->tk->total_overtime[$keys] == ""){
                            //     $txt++;
                            // }
                            // if($param->info->tk->total_work_hours[$keys] == ""){
                            //     $txt++;
                            // }
                            // if($param->info->tk->total_no_days[$keys] == ""){
                            //     $txt++;
                            // }

                            if( $txt > 0){
                                $ctr = $keys + 1;
                                $return = json_encode(array('status'=>'errortk',"row"=>$ctr));
                                print $return;
                                mysqli_close($con);
                                return;
                            }else if($txt == 0){
                                $tk[]=array(
                                    'employee_id'                           =>$param->info->tk->employee_id[$keys],
                                    'day_one'                               =>$param->info->tk->day_one[$keys],
                                    // 'day_two'                               =>$param->info->tk->day_two[$keys],
                                    // 'day_three'                             =>$param->info->tk->day_three[$keys],
                                    // 'day_four'                              =>$param->info->tk->day_four[$keys],
                                    // 'day_five'                              =>$param->info->tk->day_five[$keys],
                                    // 'day_six'                               =>$param->info->tk->day_six[$keys],
                                    // 'day_seven'                             =>$param->info->tk->day_seven[$keys],
                                    // 'day_eight'                             =>$param->info->tk->day_eight[$keys],
                                    // 'day_nine'                              =>$param->info->tk->day_nine[$keys],
                                    // 'day_ten'                               =>$param->info->tk->day_ten[$keys],
                                    // 'day_eleven'                            =>$param->info->tk->day_eleven[$keys],
                                    // 'day_twelve'                            =>$param->info->tk->day_twelve[$keys],
                                    // 'day_thirteen'                          =>$param->info->tk->day_thirteen[$keys],
                                    // 'day_fourteen'                          =>$param->info->tk->day_fourteen[$keys],
                                    // 'day_fifteen'                           =>$param->info->tk->day_fifteen[$keys],
                                    // 'first_row_overtime'                    =>$param->info->tk->first_row_overtime[$keys],
                                    // 'first_row_hours'                       =>$param->info->tk->first_row_hours[$keys],
                                    // 'first_row_no_of_days'                  =>$param->info->tk->first_row_no_of_days[$keys],

                                    // 'day_sixteen'                           =>$param->info->tk->day_sixteen[$keys],
                                    // 'day_seventeen'                         =>$param->info->tk->day_seventeen[$keys],
                                    // 'day_eighteen'                          =>$param->info->tk->day_eighteen[$keys],
                                    // 'day_nineteen'                          =>$param->info->tk->day_nineteen[$keys],
                                    // 'day_twenty'                            =>$param->info->tk->day_twenty[$keys],
                                    // 'day_twenty_one'                        =>$param->info->tk->day_twenty_one[$keys],
                                    // 'day_twenty_two'                        =>$param->info->tk->day_twenty_two[$keys],
                                    // 'day_twenty_three'                      =>$param->info->tk->day_twenty_three[$keys],
                                    // 'day_twenty_four'                       =>$param->info->tk->day_twenty_four[$keys],
                                    // 'day_twenty_five'                       =>$param->info->tk->day_twenty_five[$keys],
                                    // 'day_twenty_six'                        =>$param->info->tk->day_twenty_six[$keys],
                                    // 'day_twenty_seven'                      =>$param->info->tk->day_twenty_seven[$keys],
                                    // 'day_twenty_eight'                      =>$param->info->tk->day_twenty_eight[$keys],
                                    // 'day_twenty_nine'                       =>$param->info->tk->day_twenty_nine[$keys],
                                    // 'day_thirty'                            =>$param->info->tk->day_thirty[$keys],
                                    // 'day_thirty_one'                        =>$param->info->tk->day_thirty_one[$keys],
                                    // 'day_overtime2'                         =>$param->info->tk->day_overtime2[$keys],
                                    // 'second_row_hours'                      =>$param->info->tk->second_row_hours[$keys],
                                    // 'second_row_days'                       =>$param->info->tk->second_row_days[$keys],
                                    // 'total_overtime'                        =>$param->info->tk->total_overtime[$keys],
                                    // 'total_work_hours'                      =>$param->info->tk->total_work_hours[$keys],
                                    // 'total_no_days'                         =>$param->info->tk->total_no_days[$keys],
                                );
                            }
                        }

                        // Insert to timekeeping
                        foreach($tk as $k=>$v){

                            $Qry                = new Query();
                            $Qry->table         = "lgsa_timekeeping";
                            $Qry->selected      = "lgsa_timekeeping_client_id,
                                                   lgsa_timekeeping_client_name,
                                                   lgsa_timekeeping_period_covered_from,
                                                   lgsa_timekeeping_period_covered_to,
                                                   lgsa_timekeeping_employee_id,
                                                   lgsa_timekeeping_guard_name,
                                                   lgsa_timekeeping_guard_inspector_employee_id,
                                                   lgsa_timekeeping_guard_inspector_name,
                                                   lgsa_timekeeping_day_1,
                                                 
                                                   is_created";
                            $Qry->fields        = "'".$param->info->establishment."',
                                                    '".getClientName($con, $param->info->establishment)."',
                                                    '".$param->info->period_covered_from."',
                                                    '".$param->info->period_covered_to."',
                                                    '".$v['employee_id']."',
                                                    '".getEmployeeName($con, $v['employee_id'])."',
                                                    '".$param->accountuserid."',
                                                    '".getEmployeeName($con, $param->accountuserid)."',
                                                    '".$v['day_one']."',
                                                   
                                                    '".$datetime."'";
                            $rs                 = $Qry->_insert($con);
                            if(!$rs){
                                $return =  json_encode(array('status'=>'noentrytk',mysqli_error($con)));
                                print $return;
                                mysqli_close($con);
                                return;
                            }else{
                                $proceed = 1;
                            }
                        }

                        // Proceed
                        if($proceed == 1){

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
                                                 'addTimeKeeping',
                                                 'timekeepingController',
                                                 'created',
                                                 '".$datetime."'";
                            $rs_b             = $Qry_b->_insert($con);
                            if($rs_b){
                                $return = json_encode(array('status'=>'success'));
                            }else{
                                $return = json_encode(array('status'=>'error','insert','lgsa_user_log', mysqli_error($con)));
                            }


                            $return = json_encode(array("status"=>"success"));
                        }else{
                            $return = json_encode(array("status"=>"error",mysqli_error($con)));
                        }

                    }else{
                        $return = json_encode(array("status"=>"incorrectdaterange"));
                    }
                }else{
                    $return = json_encode(array("status"=>"noperiodcoveredto"));
                }
            }else{
                $return = json_encode(array("status"=>"noperiodcoveredfrom"));
            }
        }else{
            $return = json_encode(array("status"=>"noestablishment"));
        }
    }else{
        $return = json_encode(array("status"=>"notloggedin"));
    }





print $return;
mysqli_close($con);

?>