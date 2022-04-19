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

    //Search
    if( !empty( $param['search']['value'] ) ){
        $search='';
        $search=" AND ( lgsa_user_id like '%".$param['search']['value']."%' ";
        $search=$search." OR lgsa_user_employee_id like '%".$param['search']['value']."%' ";
        $search=$search." OR lgsa_user_firstname like '%".$param['search']['value']."%' ";
        $search=$search." OR lgsa_user_middlename like '%".$param['search']['value']."%' ";
        $search=$search." OR lgsa_user_lastname like '%".$param['search']['value']."%' ";
        $search=$search." OR lgsa_user_role like '%".$param['search']['value']."%' ";
        $search=$search." OR lgsa_account_status like '%".$param['search']['value']."%' ) ";
    }

    // Filter by page start of 10
    $filter = $search;

    $s_page = $param['start'];
    $p_page = $param['length'];

    if($param['order'][0]['column']!=''){
        $cols  = array('lgsa_user_id','lgsa_user_employee_id','lgsa_user_firstname','lgsa_user_middlename','lgsa_user_lastname','lgsa_user_role','lgsa_account_status');
        if($param['length']==-1){
            $search=$search." ORDER BY ".$cols[ $param['order'][0]['column'] ]." ".$param['order'][0]['dir']."";
        }else{
            $search=$search." ORDER BY ".$cols[ $param['order'][0]['column'] ]." ".$param['order'][0]['dir']." LIMIT ".$s_page.",".$p_page;
        }
    }

    if(!empty($param['accountuserid'])){
        $Qry=new Query();
        $Qry->table="lgsa_user";
        $Qry->selected="*";
        $Qry->fields="lgsa_user_id > 0".$search;
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
                if($row['lgsa_account_status'] == 'Blocked'){
                    $acctStat = 'Blocked';
                    $acct_icon = 'label label-warning bg-red';
                }
                $data["data"][] = array(
                    'id'=>$i,
                    'user_id'=>$row['lgsa_user_id'],
                    'employee_id'=>$row['lgsa_user_employee_id'],
                    'profile_pic'=>$row['lgsa_user_profile_pic'].'?'.time(),
                    'firstname'=>$row['lgsa_user_firstname'],
                    'middlename'=>$row['lgsa_user_middlename'],
                    'lastname'=>$row['lgsa_user_lastname'],
                    'suffix'=>$row['lgsa_user_suffix'],
                    'account_name'=>ucfirst($row['lgsa_user_firstname']).' '.ucfirst(substr($row['lgsa_user_middlename'],-1)).'. '.ucfirst($row['lgsa_user_lastname']).' '.ucfirst($row['lgsa_user_suffix']).'. ',
                    'account_role'=>strtoupper($row['lgsa_user_role']),
                    'status'=>strtoupper($row['lgsa_account_status']),
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
    $Qry->table="lgsa_user";
    $Qry->selected="*";
    $Qry->fields="lgsa_user_id > 0".$search;
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