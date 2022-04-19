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

    if( !empty( $param['search']['value'] ) ){
        $search='';
        $search=" AND ( lgsa_payroll_number like '%".$param['search']['value']."%' ";
        $search=$search." OR lgsa_payroll_guard_name like '%".$param['search']['value']."%' ";
        $search=$search." OR lgsa_payroll_client_name like '%".$param['search']['value']."%' ) ";
    }

    // Filter by page start of 10
    $filter = $search;

    $s_page = $param['start'];
    $p_page = $param['length'];

    if($param['order'][0]['column']!=''){
        $cols  = array('lgsa_payroll_number','lgsa_payroll_guard_name','lgsa_payroll_client_name');
        if($param['length']==-1){
            $search=$search." ORDER BY ".$cols[ $param['order'][0]['column'] ]." ".$param['order'][0]['dir']."";
        }else{
            $search=$search." ORDER BY ".$cols[ $param['order'][0]['column'] ]." ".$param['order'][0]['dir']." LIMIT ".$s_page.",".$p_page;
        }
    }

    if(!empty($param['accountuserid'])){
        $Qry=new Query();
        $Qry->table="lgsa_payroll";
        $Qry->selected="*";
        $Qry->fields="lgsa_payroll_id > 0".$search;
        $rs=$Qry->_select($con);
        // echo $Qry->fields;
        // echo $search;
        if(mysqli_num_rows($rs)>0){
            $i = 1;
            $data = array(
                "draw"=>$param['draw'],
                "recordsTotal"=>mysqli_num_rows($rs),
                "recordsFiltered"=>get_total_rows($con, $param, $filter),
                "data"=>array()
            );
            while($row=mysqli_fetch_array($rs)){
                // $acctStat = 'Pending';
                // $acct_icon = 'label label-primary bg-blue';
                // if($row['lgsa_voucher_status'] == 'Approved'){
                //     $acctStat = 'Approved';
                //     $acct_icon = 'label label-warning bg-orange';
                // }else if($row['lgsa_voucher_status'] == 'Disapproved'){
                //     $acctStat = 'Disapproved';
                //     $acct_icon = 'label label-danger bg-red';
                // }else if($row['lgsa_voucher_status'] == 'Closed'){
                //     $acctStat = 'Closed';
                //     $acct_icon = 'label label-success bg-green';
                // }
                $data["data"][] = array(
                    'id'=>$i,
                    'user_id'=>$row['lgsa_payroll_id'],
                    'payroll_number'=>$row['lgsa_payroll_number'],
                    'guard_name'=>$row['lgsa_payroll_guard_name'],
                    'client_name'=>$row['lgsa_payroll_client_name'],
                    'from'=>$row['lgsa_payroll_from_date'],
                    'to'=>$row['lgsa_payroll_to_date'],
                    // 'status'=>strtoupper($row['lgsa_voucher_status']),
                    // 'account_icon'=>$acct_icon,
                );
                $i++;
            }
            $return = json_encode($data);
        }else{
            $data = array(
                "draw"=>$param['draw'],
                "recordsTotal"=>mysqli_num_rows($rs),
                "recordsFiltered"=>mysqli_num_rows($rs),
                "data"=>array()
            );
            $return = json_encode($data);
        }
    }else{
        $return = json_encode(array('status'=>'error'));
    }

print $return;
mysqli_close($con);

function get_total_rows($con, $param, $search){
    $rowCount='';

    $Qry=new Query();
    $Qry->table="lgsa_payroll";
    $Qry->selected="*";
    $Qry->fields="lgsa_payroll_id > 0".$search;
    $rs=$Qry->_select($con);
    if(mysqli_num_rows($rs)>=1){
        while($row=mysqli_fetch_array($rs)){
            $rowCount = mysqli_num_rows($rs);
        }
        return $rowCount;
    }else{
        return null;
    }
}


?>