<?php 
 	require_once('../database.php');
    require_once('../utils.php');
    // require_once('../function/getData.php');
	$conn = new connector();
	$con = $conn->connect();


$param = json_decode(file_get_contents('php://input'));

$date = SysDate();
$time = SysTime();
$return = '';

    $Qry=new Query();
    $Qry->table="lgsa_cash_advance AS lca INNER JOIN
                lgsa_cashadvance_employee_name AS lcen ON
                lca.lgsa_cash_advance_control_no = lcen.lgsa_cashadvance_control_no";
    $Qry->selected="lcen.lgsa_cashadvance_employee_name_id,lca.lgsa_cash_advance_control_no, lcen.lgsa_cashadvance_employee_id, lcen.lgsa_cashadvance_name,
                    lca.lgsa_cash_advance_client_id, lca.lgsa_cash_advance_client_name, lca.lgsa_cash_advance_date, lcen.lgsa_cashadvance_employee_amount,
                    lca.lgsa_cash_advance_requested_by_employee_id,lgsa_cash_advance_requested_by_name,
                    lca.lgsa_cash_advance_approved_by_employee_id, lca.lgsa_cash_advance_approved_by_name, lca.lgsa_cash_advance_approved_date,
                    lca.lgsa_cash_advance_total, lca.lgsa_cash_advance_status";
    $Qry->fields="lcen.lgsa_cashadvance_employee_name_id='".$param->cashadvance_id."'";
    $rs=$Qry->_select($con);	
    if(mysqli_num_rows($rs)>=1){
        while($row=mysqli_fetch_array($rs)){

            $data = array( 
                'edit_cashadvance_id'            =>$row['lgsa_cashadvance_employee_name_id'],
                'cashadvance_client_edit_id'     =>$row['lgsa_cash_advance_client_id'],
                'edit_cashadvance_client_name'   =>$row['lgsa_cash_advance_client_name'],
                'edit_prepared_by_employee_id'   =>$row['lgsa_cash_advance_requested_by_employee_id'],
                'edit_prepared_by_name'          =>$row['lgsa_cash_advance_requested_by_name'],
                'cashadvance_date_edit'          =>$row['lgsa_cash_advance_date'],
                'cashadvance_control_no'         =>$row['lgsa_cash_advance_control_no'],
                'cashadvance_employee_id'        =>$row['lgsa_cashadvance_employee_id'],
                'cashadvance_name'               =>$row['lgsa_cashadvance_name'],
                'cashadvance_amount'             =>$row['lgsa_cashadvance_employee_amount'],
                'cashadvance_total_edit'         =>$row['lgsa_cash_advance_total'],

                // 'get_cashadvance_employee'       =>getCashAdvanceName($con, $row['lgsa_cash_advance_id'])

            );
        } 
        $return = json_encode($data);
    }else{
        $return = json_encode(array('status'=>'empty'));
    }


print $return;
mysqli_close($con);

		

?>