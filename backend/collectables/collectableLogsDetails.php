<?php
require_once('../database.php');
require_once('../utils.php');
$conn = new connector();
$con = $conn->connect();

    $param=$_POST;
    $return=null;
    $search='';
    $date = SysDate();
    $time = SysTime();


    if(!empty($param['accountid'])){
        $Qry=new Query();
        $Qry->table="lgsa_collectible_logs";
        $Qry->selected="*";
        $Qry->fields="lgsa_collectible_logs_client_id='".$param['client_id']."' ORDER BY lgsa_collectible_logs_id ASC";
        $rs=$Qry->_select($con);
        // echo $Qry->fields;
        // echo $search;
        if(mysqli_num_rows($rs)>0){
            while($row=mysqli_fetch_array($rs)){
                $acctStat = 'Collectible';
                $acct_icon = 'label label-danger bg-red';
                if($row['lgsa_collectible_logs_status'] == 'Paid'){
                    $acctStat = 'Paid';
                    $acct_icon = 'label label-success bg-green';
                }
                $data["data"][] = array(
                    'logs_id'=>$i,
                    'logs_client_name'     =>$row['lgsa_collectible_logs_client_name'],
                    'logs_date_from_to'    =>$row['lgsa_collectible_logs_date_from'].' '.$row['lgsa_collectible_logs_date_to'],
                    'logs_total'           =>$row['lgsa_collectible_logs_total'],
                    'logs_amount_collected'=>$row['lgsa_collectible_logs_amount_collected'],
                    'logs_balance'         =>$row['lgsa_collectible_logs_balance'],
                    'logs_date_collected'  =>$row['lgsa_collectible_logs_date_collected'],
                    'logs_datetime_updated'  =>$row['lgsa_collectible_logs_updated_datetime'],
                    'logs_date_updated_by'  =>$row['lgsa_collectible_logs_updated_by_employee_name'],
                    'logs_status'=>strtoupper($row['lgsa_collectible_logs_status']),
                    'account_icon'=>$acct_icon,
                );
                $i++;
            }
            $return = json_encode($data);
        }else{
            $return = json_encode(
                $data = array('data'=>'')
            );
        }
    }else{
        $return = json_encode(array('status'=>'error'));
    }


print $return;
mysqli_close($con);


?>