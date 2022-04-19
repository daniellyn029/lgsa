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
    $date_hired = '';

    if( !empty( $param['search']['value'] ) ){
        $search='';
        $search=" AND ( lgsa_employee_id like '%".$param['search']['value']."%' ";
        $search=$search." OR lgsa_guard_firstname like '%".$param['search']['value']."%' ";
        $search=$search." OR lgsa_guard_middlename like '%".$param['search']['value']."%' ";
        $search=$search." OR lgsa_guard_lastname like '%".$param['search']['value']."%' ";
        $search=$search." OR lgsa_guard_client_name like '%".$param['search']['value']."%' ";
        $search=$search." OR lgsa_employee_date_hired like '%".$param['search']['value']."%' ";
        $search=$search." OR lgsa_employee_status like '%".$param['search']['value']."%' ) ";
    }

    // Filter by page start of 10
    $filter = $search;

    $s_page = $param['start'];
    $p_page = $param['length'];

    if($param['order'][0]['column']!=''){
        $cols  = array('lgsa_employee_id','lgsa_guard_middlename','lgsa_guard_lastname','lgsa_guard_client_name','lgsa_employee_date_hired','lgsa_employee_status');
        if($param['length']==-1){
            $search=$search." ORDER BY ".$cols[ $param['order'][0]['column'] ]." ".$param['order'][0]['dir']."";
        }else{
            $search=$search." ORDER BY ".$cols[ $param['order'][0]['column'] ]." ".$param['order'][0]['dir']." LIMIT ".$s_page.",".$p_page;
        }
    }

    if(!empty($param['accountuserid'])){
        $Qry=new Query();
        $Qry->table="lgsa_employee";
        $Qry->selected="*";
        $Qry->fields="lgsa_employee_id > 0".$search;
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
                $acctStat = 'Active';
                $acct_icon = 'label label-success bg-green';
                if($row['lgsa_employee_status'] == 'Applicant'){
                    $acctStat = 'Applicant';
                    $acct_icon = 'label label-info bg-blue';
                }else if($row['lgsa_employee_status'] == 'Blocked'){
                    $acctStat = 'Blocked';
                    $acct_icon = 'label label-danger bg-red';
                }else if($row['lgsa_employee_status'] == 'Awol'){
                    $acctStat = 'Awol';
                    $acct_icon = 'label label-warning bg-orange';
                }
                if($row['lgsa_employee_date_hired'] == '1111-11-11'){
                    $date_hired = '';

                }else{
                    $date_hired = $row['lgsa_employee_date_hired'];
                }

                $data["data"][] = array(
                    'id'=>$i,
                    'user_id'=>$row['lgsa_employee_id'],
                    'guard_id'=>$row['lgsa_guard_employee_id'],
                    'profile_pic'=>$row['lgsa_employee_profpic'].'?'.time(),
                    'firstname'=>$row['lgsa_guard_firstname'],
                    'middlename'=>$row['lgsa_guard_middlename'],
                    'lastname'=>$row['lgsa_guard_lastname'],
                    'suffix'=>$row['lgsa_guard_suffix'],
                    'name'=>ucfirst($row['lgsa_guard_firstname']).' '.ucfirst(substr($row['lgsa_guard_middlename'],-1)).'. '.ucfirst($row['lgsa_guard_lastname']).' '.ucfirst($row['lgsa_guard_suffix']).'. ',
                    'posting_area'=>strtoupper($row['lgsa_guard_client_name']),
                    'date_hired'=>$date_hired,
                    'status'=>strtoupper($row['lgsa_employee_status']),
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
    $Qry->table="lgsa_employee";
    $Qry->selected="*";
    $Qry->fields="lgsa_employee_id > 0".$search;
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