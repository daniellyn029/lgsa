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
        $search=" AND ( lcen.lgsa_cashadvance_employee_name_id like '%".$param['search']['value']."%' ";
        $search=$search." OR lca.lgsa_cash_advance_control_no like '%".$param['search']['value']."%' ";
        $search=$search." OR lcen.lgsa_cashadvance_name like '%".$param['search']['value']."%' ";
        $search=$search." OR lca.lgsa_cash_advance_client_name like '%".$param['search']['value']."%' ";
        $search=$search." OR lca.lgsa_cash_advance_requested_by_name like '%".$param['search']['value']."%' ";
        $search=$search." OR lca.lgsa_cash_advance_status like '%".$param['search']['value']."%' ) ";
    }

    // Filter by page start of 10
    $filter = $search;

    $s_page = $param['start'];
    $p_page = $param['length'];

    if($param['order'][0]['column']!=''){
        $cols  = array('lcen.lgsa_cashadvance_employee_name_id','lca.lgsa_cash_advance_control_no','lcen.lgsa_cashadvance_name','lca.lgsa_cash_advance_client_name','lca.lgsa_cash_advance_requested_by_name','lca.lgsa_cash_advance_status');
        if($param['length']==-1){
            $search=$search." ORDER BY ".$cols[ $param['order'][0]['column'] ]." ".$param['order'][0]['dir']."";
        }else{
            $search=$search." ORDER BY ".$cols[ $param['order'][0]['column'] ]." ".$param['order'][0]['dir']." LIMIT ".$s_page.",".$p_page;
        }
    }

    if(!empty($param['accountuserid'])){
        $Qry=new Query();
        $Qry->table="lgsa_cash_advance AS lca INNER JOIN
                    lgsa_cashadvance_employee_name AS lcen ON
                    lca.lgsa_cash_advance_control_no = lcen.lgsa_cashadvance_control_no";
        $Qry->selected="lcen.lgsa_cashadvance_employee_name_id,lca.lgsa_cash_advance_control_no, lcen.lgsa_cashadvance_employee_id, lcen.lgsa_cashadvance_name,
                        lca.lgsa_cash_advance_client_id, lca.lgsa_cash_advance_client_name, lca.lgsa_cash_advance_date, lcen.lgsa_cashadvance_employee_amount,
                        lca.lgsa_cash_advance_requested_by_employee_id,lgsa_cash_advance_requested_by_name,
                        lca.lgsa_cash_advance_approved_by_employee_id, lca.lgsa_cash_advance_approved_by_name, lca.lgsa_cash_advance_approved_date,
                        lca.lgsa_cash_advance_total, lca.lgsa_cash_advance_status";
        $Qry->fields="lcen.lgsa_cashadvance_employee_name_id > 0".$search;
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
                $acctStat = 'Pending';
                $acct_icon = 'label label-danger bg-red';
                if($row['lgsa_cash_advance_status'] == 'Approved'){
                    $acctStat = 'Approved';
                    $acct_icon = 'label label-success bg-green';
                }else if($row['lgsa_cash_advance_status'] == 'Disapproved'){
                    $acctStat = 'Disapproved';
                    $acct_icon = 'label label-warning bg-yellow';
                }else if($row['lgsa_cash_advance_status'] == 'Closed'){
                    $acctStat = 'Closed';
                    $acct_icon = 'label label-info bg-blue';
                }
                $data["data"][] = array(
                    'id'=>$i,
                    'cashadvance_id'=>$row['lgsa_cashadvance_employee_name_id'],
                    'control_no'=>$row['lgsa_cash_advance_control_no'],
                    'guard_name'=>$row['lgsa_cashadvance_name'],                
                    'client_name'=>strtoupper($row['lgsa_cash_advance_client_name']),
                    'date_entered'=>$row['lgsa_cash_advance_date'],
                    'prepared_by'=>$row['lgsa_cash_advance_requested_by_name'],
                    'amount'=>$row['lgsa_cashadvance_employee_amount'],
                    'status'=>strtoupper($row['lgsa_cash_advance_status']),
                    'account_icon'=>$acct_icon,
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
    $Qry->table="lgsa_cash_advance AS lca INNER JOIN
                lgsa_cashadvance_employee_name AS lcen ON
                lca.lgsa_cash_advance_control_no = lcen.lgsa_cashadvance_control_no";
    $Qry->selected="lcen.lgsa_cashadvance_employee_name_id,lca.lgsa_cash_advance_control_no, lcen.lgsa_cashadvance_employee_id, lcen.lgsa_cashadvance_name,
                    lca.lgsa_cash_advance_client_id, lca.lgsa_cash_advance_client_name, lca.lgsa_cash_advance_date, lcen.lgsa_cashadvance_employee_amount,
                    lca.lgsa_cash_advance_requested_by_employee_id,lgsa_cash_advance_requested_by_name,
                    lca.lgsa_cash_advance_approved_by_employee_id, lca.lgsa_cash_advance_approved_by_name, lca.lgsa_cash_advance_approved_date,
                    lca.lgsa_cash_advance_total, lca.lgsa_cash_advance_status";
    $Qry->fields="lcen.lgsa_cashadvance_employee_name_id > 0".$search;
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