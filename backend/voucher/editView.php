<?php 
 	require_once('../database.php');
    require_once('../utils.php');
    require_once('../function/getData.php');
	$conn = new connector();
	$con = $conn->connect();


$param = json_decode(file_get_contents('php://input'));

$date = SysDate();
$time = SysTime();
$return = '';

    $Qry=new Query();
    $Qry->table="lgsa_voucher";
    $Qry->selected="*";
    $Qry->fields="lgsa_voucher_id='".$param->voucher_id."'";
    $rs=$Qry->_select($con);	
    if(mysqli_num_rows($rs)>=1){
        while($row=mysqli_fetch_array($rs)){

            $data[] = array( 
                'edit_voucher_id'                   =>$row['lgsa_voucher_id'],
                'edit_prepared_by_employee_id'      =>$row['lgsa_voucher_prepared_by_employee_id'],
                'edit_prepared_by_employee_name'    =>$row['lgsa_voucher_prepared_by_name'],
                'edit_voucher_employee_name'        =>$row['lgsa_payee_full_name'],
                'edit_voucher_employee_id'          =>$row['lgsa_payee_employee_id'],
                'edit_voucher_date'			        =>$row['lgsa_voucher_date'],
                'edit_voucher_control_no'			=>$row['lgsa_control_no'],
                'edit_voucher_contact_no'           =>$row['lgsa_payee_contact_no'],
                'edit_voucher_address'         	    =>$row['lgsa_payee_address'],
                'voucher_total_edit'                =>$row['lgsa_voucher_total'],
                'get_voucher_particulars'           =>getVoucherParticulars($con, $row['lgsa_voucher_id'])

            );
        } 
        $return = json_encode($data);
    }else{
        //$return = json_encode(array('status'=>'empty'));
        $data[] = array( 
            'status'                            =>'empty',
            'edit_voucher_id'                   =>'',
            'edit_prepared_by_employee_id'      =>'',
            'edit_prepared_by_employee_name'    =>'',
            'edit_voucher_employee_name'        =>'',
            'edit_voucher_employee_id'          =>'',
            'edit_voucher_date'			        =>'',
            'edit_voucher_control_no'			=>'',
            'edit_voucher_contact_no'           =>'',
            'edit_voucher_address'         	    =>'',
            'voucher_total_edit'         	    =>'',
            'voucher'                           =>array("particulars"=>array(),"amount"=>array())

        );
    }
    $return = json_encode($data);

print $return;
mysqli_close($con);



?>