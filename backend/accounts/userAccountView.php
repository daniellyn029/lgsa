<?php
require_once('../database.php');
require_once('../utils.php');
require_once('../function/password.php');
$conn = new connector();    
$con = $conn->connect();


$param = json_decode(file_get_contents('php://input'));

$date = SysDate();
$time = SysTime();
$return = '';


    //Display Guard
    $Qry=new Query();
    $Qry->table="lgsa_user";
    $Qry->selected="*";
    $Qry->fields="lgsa_user_employee_id='".$param->employee_id."'";
    $rs=$Qry->_select($con);	
    if(mysqli_num_rows($rs)>=1){
        while($row=mysqli_fetch_array($rs)){
            $pic= "user-icon.png";
            if( !empty( $row['lgsa_user_profile_pic'] ) ){
                $pic = $row['lgsa_user_profile_pic'];
            }
            $data = array( 
                'edit_picFile'	    		=>'frontend/assets/images/profile_pic/'.$pic.'?'.time(),
                'edit_prof_pic'           	=>'',
                'edit_id'                   =>$row['lgsa_user_id'],
                'edit_employeeid123'        =>$row['lgsa_user_employee_id'],
                'edit_firstname'           	=>$row['lgsa_user_firstname'],
                'edit_middlename'			=>$row['lgsa_user_middlename'],
                'edit_lastname'         	=>$row['lgsa_user_lastname'],
                'edit_suffix'         	    =>$row['lgsa_user_suffix'],
                'edit_username'             =>$row['lgsa_user_username'],
                'edit_password'             =>$row['lgsa_user_password'],
                'edit_address'         	    =>$row['lgsa_user_address'],
                'edit_cp'        	        =>$row['lgsa_user_contact_number'],
                'edit_email_address'        =>$row['lgsa_user_email_address'],
                'edit_gender'     	        =>$row['lgsa_user_gender'],
                'edit_birthdate'           	=>$row['lgsa_user_birthdate'],
                'edit_account_role'         =>$row['lgsa_user_role'],
                'edit_email_status'         =>$row['lgsa_email_status'],
                'edit_account_status'       =>$row['lgsa_account_status'],


            );
        } 
        $return = json_encode($data);
    }



print $return;
mysqli_close($con);


?>