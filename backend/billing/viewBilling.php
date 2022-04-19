<?php 
require_once('../database.php');
require_once('../utils.php');
$conn = new connector();
$con = $conn->connect();


$param = json_decode(file_get_contents('php://input'));
$date = SysDate();
$time = SysTime();
$return = '';

//Display Guard
$Qry=new Query();
$Qry->table="lgsa_billing";
$Qry->selected="*";
$Qry->fields="lgsa_billing_id='".$param->billing_id."'";
$rs=$Qry->_select($con);	
if(mysqli_num_rows($rs)>=1){
    while($row=mysqli_fetch_array($rs)){
        $data = array( 

            'edit_billing_id'                   =>$row['lgsa_billing_id'],
            'edit_client_name'                  =>$row['lgsa_billing_client_name'],
            'edit_client_name_id'               =>$row['lgsa_billing_client_id'],
            'edit_date_issued'                  =>$row['lgsa_billing_date_issued'],
            'edit_address'                      =>$row['lgsa_billing_client_address'],
            'edit_cp'                           =>$row['lgsa_billing_contact_number'],
            'edit_amount'                       =>$row['lgsa_billing_amount'],
            'edit_particulars'                  =>$row['lgsa_billing_particulars'],
            'edit_prepared_by_employee_id'      =>$row['lgsa_billing_prepared_by_employee_id'],
            'edit_prepared_by_employee_name'    =>$row['lgsa_billing_prepared_by_employee_name'],

        );
    } 
 	$return = json_encode($data);
}


print $return;
mysqli_close($con);

		

?>