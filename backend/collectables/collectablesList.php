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
        $search=" AND ( lgsa_collectible_client_name like '%".$param['search']['value']."%' ";
        $search=$search." OR lgsa_collectible_from_date like '%".$param['search']['value']."%' ";
        $search=$search." OR lgsa_collectible_to_date like '%".$param['search']['value']."%' ";
        $search=$search." OR lgsa_collectible_amount like '%".$param['search']['value']."%' ";
        $search=$search." OR lgsa_collectible_status like '%".$param['search']['value']."%' ) ";
    }

    // Filter by page start of 10
    $filter = $search;

    $s_page = $param['start'];
    $p_page = $param['length'];

    if($param['order'][0]['column']!=''){
        $cols  = array('lgsa_collectible_client_name','lgsa_collectible_from_date','lgsa_collectible_to_date','lgsa_collectible_amount','lgsa_collectible_status');
        if($param['length']==-1){
            $search=$search." ORDER BY ".$cols[ $param['order'][0]['column'] ]." ".$param['order'][0]['dir']."";
        }else{
            $search=$search." ORDER BY ".$cols[ $param['order'][0]['column'] ]." ".$param['order'][0]['dir']." LIMIT ".$s_page.",".$p_page;
        }
    }

    if(!empty($param['accountuserid'])){
        $Qry=new Query();
        $Qry->table="lgsa_collectible";
        $Qry->selected="*";
        $Qry->fields="lgsa_collectible_id > 0".$search;
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
                $acctStat = 'Collectible';
                $acct_icon = 'label label-danger bg-red';
                if($row['lgsa_collectible_status'] == 'Paid'){
                    $acctStat = 'Paid';
                    $acct_icon = 'label label-success bg-green';
                }
                $data["data"][] = array(
                    'id'=>$i,
                    'client_id'=>$row['lgsa_collectible_id'],
                    'client_name'=>strtoupper($row['lgsa_collectible_client_name']),
                    'from_date'=>$row['lgsa_collectible_from_date'],
                    'to_date'=>$row['lgsa_collectible_to_date'],
                    'date_issued'=>$row['lgsa_collectible_date_issued'],
                    'total'=>$row['lgsa_collectible_total'],
                    'collected_amount'=>$row['lgsa_collectible_collected_amount'],
                    'balance'=>$row['lgsa_collectible_balance'],
                    'date_collected'=>$row['lgsa_collectible_date_collected'],
                    'status'=>strtoupper($row['lgsa_collectible_status']),
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
    $Qry->table="lgsa_collectible";
    $Qry->selected="*";
    $Qry->fields="lgsa_collectible_id > 0".$search;
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