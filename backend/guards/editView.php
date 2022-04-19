<?php 
 	require_once('../database.php');
    require_once('../utils.php');
	$conn = new connector();
	$con = $conn->connect();


$param = json_decode(file_get_contents('php://input'));

$date = SysDate();
$time = SysTime();
$return = '';
$date_hired = '';

//Display Guard
$Qry=new Query();
$Qry->table="lgsa_employee";
$Qry->selected="*";
$Qry->fields="lgsa_guard_employee_id='".$param->guard_id."'";
$rs=$Qry->_select($con);	
if(mysqli_num_rows($rs)>=1){
    while($row=mysqli_fetch_array($rs)){
        $pic= "user-icon.png";
        if( !empty( $row['lgsa_employee_profpic'] ) ){
            $pic = $row['lgsa_employee_profpic'];
        }

        if($row['lgsa_employee_date_hired'] == '1111-11-11'){
            $date_hired = '';

        }else{
            $date_hired = $row['lgsa_employee_date_hired'];
        }

        $data = array( 
            'edit_id'                   =>$row['lgsa_employee_id'],
	        'edit_picFile'	    		=>'frontend/assets/images/profile_pic/'.$pic.'?'.time(),
            'edit_prof_pic'           	=>'',
            'edit_employeeid'           =>$row['lgsa_guard_employee_id'],
            'edit_client_name_id'        =>$row['lgsa_guard_client_id'],
            'edit_client_name'           =>$row['lgsa_guard_client_name'],
	        'edit_firstname'           	=>$row['lgsa_guard_firstname'],
			'edit_middlename'			=>$row['lgsa_guard_middlename'],
            'edit_lastname'         	=>$row['lgsa_guard_lastname'],
            'edit_suffix'         	    =>$row['lgsa_guard_suffix'],
	        'edit_present_address'      =>$row['lgsa_guard_present_address'],
	        'edit_provincial_address'   =>$row['lgsa_guard_provincial_address'],
	        'edit_gender'         	    =>$row['lgsa_guard_gender'],
	        'edit_birthdate'        	=>$row['lgsa_guard_birthdate'],
	        'edit_age'          	    =>$row['lgsa_guard_age'],
	        'edit_birthplace'     	    =>$row['lgsa_guard_birthplace'],
	        'edit_emergency'           	=>$row['lgsa_guard_incase_emergency'],
	        'edit_relationship'         =>$row['lgsa_guard_emergency_relationship'],
	        'edit_emeradd'            	=>$row['lgsa_guard_emergency_address'],
	        'edit_emernum'      	    =>$row['lgsa_guard_emergency_cp_num'],
	        'edit_height'           	=>$row['lgsa_guard_height'],
	        'edit_weight'           	=>$row['lgsa_guard_weight'],
	        'edit_cpnum'            	=>$row['lgsa_guard_cp_num'],
            'edit_civil_status'     	=>$row['lgsa_guard_marital_stat'],
            'edit_spouse'    	        =>$row['lgsa_guard_name_spouse'],
            'edit_spouse_add'    	    =>$row['lgsa_guard_name_spouse_address'],
            'edit_supported'    	    =>$row['lgsa_guard_person_supported'],
            'edit_supp_rel'         	=>$row['lgsa_guard_person_supported_rel'],
            'edit_work_desire'       	=>$row['lgsa_guard_work_desire'],
            'edit_sal_exp'          	=>$row['lgsa_guard_expected_salary'],
            'edit_intro'    	        =>$row['lgsa_guard_introduce'],
            'edit_hob_rec'             	=>$row['lgsa_guard_hobby_recreation'],
            'edit_elem_scho'    	    =>$row['lgsa_guard_elem_school'],
            'edit_elem_year'    	    =>$row['lgsa_guard_elem_year'],
            'edit_high_scho'    	    =>$row['lgsa_guard_high_school'],
            'edit_high_year'    	    =>$row['lgsa_guard_high_year'],
            'edit_coll_scho'    	    =>$row['lgsa_guard_coll_school'],
            'edit_coll_year'    	    =>$row['lgsa_guard_coll_year'],
            'edit_deg_scho'         	=>$row['lgsa_guard_deg_school'],
            'edit_deg_year'    	        =>$row['lgsa_guard_deg_year'],
            'edit_vo_scho'          	=>$row['lgsa_guard_voc_school'],
            'edit_vo_year'          	=>$row['lgsa_guard_voc_year'],
            'edit_prev_emp'          	=>$row['lgsa_guard_previous_employer'],
            'edit_prev_add'    	        =>$row['lgsa_guard_previous_employer_add'],
            'edit_from'    	            =>$row['lgsa_guard_employment_from'],
            'edit_to'    	            =>$row['lgsa_guard_employment_to'],
            'edit_salar'    	        =>$row['lgsa_guard_employment_salary'],
            'edit_work_done'    	    =>$row['lgsa_guard_work_done'],
            'edit_reas_leav'    	    =>$row['lgsa_guard_reason_living'],
            'edit_sss'              	=>$row['lgsa_guard_sss'],
            'edit_philhealth'    	    =>$row['lgsa_guard_philhealth'],
            'edit_pagibig'    	        =>$row['lgsa_guard_pagibig'],
            'edit_tax'    	            =>$row['lgsa_guard_tin'],
            'edit_date_hired'    	    =>$date_hired,
            'edit_status'    	        =>$row['lgsa_employee_status'],

        );
    } 
 	$return = json_encode($data);
}


print $return;
mysqli_close($con);

		

?>