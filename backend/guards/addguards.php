<?php
require_once('../database.php');
require_once('../utils.php');
$conn = new connector();
$con = $conn->connect();

$param = $_POST;
$date = SysDate();
$time = SysTime();
$datetime = $date.' '.$time;

// Date Employment From
if($param['add_from']=='' || $param['add_from']==null){
    $param['add_from'] = '1111-11-11';
}

// Date Employment To
if($param['add_to']=='' || $param['add_to']==null){
    $param['add_to'] = '1111-11-11';
}

// Date Hired
if($param['add_date_hired']=='' || $param['add_date_hired']==null){
    $param['add_date_hired'] = '1111-11-11';
}


//Check if already logged in
if( !empty($param['accountuserid']) ){

    //check if their is upload picture
    if( array_key_exists('file',$_FILES) ){
        $valid_formats = array("jpg", "png", "jpeg");	
        if ($_FILES['file']['error'] == 4) {
            $return = json_encode(array('status'=>'error','on'=>'img_check'));
            print $return;	
            mysqli_close($con);
            return;
        }
        if ($_FILES['file']['error'] == 0) {
            if(!in_array(pathinfo(strtolower($_FILES['file']['name']), PATHINFO_EXTENSION), $valid_formats) ){
                $return = json_encode(array('status'=>'error-upload-type'));
                print $return;	
                mysqli_close($con);
                return;
            }
        }
    }

        $pp='';
        if( array_key_exists('file',$_FILES) ){
            $extMove = pathinfo($_FILES['file']['name'], PATHINFO_EXTENSION);
            $pp    = $param['add_employeeid'].".".$extMove;
        }

        if(!empty($param['add_employeeid'])){
            if(!empty($param['add_firstname'])){
                if(!empty($param['add_middlename'])){
                    if(!empty($param['add_lastname'])){
                        if(!empty($param['add_present_address'])){
                            if(!empty($param['add_gender'])){
                                if(!empty($param['add_birthdate'])){
                                    if(!empty($param['add_age'])){
                                        if(!empty($param['add_birthplace'])){
                                            if(!empty($param['add_emergency'])){
                                                if(!empty($param['add_relationship'])){
                                                    if(!empty($param['add_emeradd'])){
                                                        if(!empty($param['add_emernum'])){
                                                            if(!empty($param['add_cpnum'])){
                                                                if(!empty($param['add_civil_status'])){
                                                                    // if(!empty($param['add_work_desire'])){
                                                                        if(!empty($param['add_sal_exp'])){
                                                                            // if(!empty($param['add_hob_rec'])){
                                                                                if(!empty($param['add_elem_scho'])){
                                                                                    // if(!empty($param['add_elem_year'])){
                                                                                        if(!empty($param['add_high_scho'])){
                                                                                            // if(!empty($param['add_high_year'])){



                                                                                                //clean string
                                                                                                $param['add_employeeid']                = (str_replace("'","",$param['add_employeeid']));
                                                                                                $param['add_firstname']                = (str_replace("'","",$param['add_firstname']));
                                                                                                $param['add_middlename']               = (str_replace("'","",$param['add_middlename']));
                                                                                                $param['add_lastname']                 = (str_replace("'","",$param['add_lastname']));
                                                                                                $param['add_suffix']                   = (str_replace("'","",$param['add_suffix']));
                                                                                                $param['add_present_address']          = (str_replace("'","",$param['add_present_address']));
                                                                                                $param['add_provincial_address']       = (str_replace("'","",$param['add_provincial_address']));
                                                                                                $param['add_gender']                   = (str_replace("'","",$param['add_gender']));
                                                                                                $param['add_birthdate']                = (str_replace("'","",$param['add_birthdate']));
                                                                                                $param['add_age']                      = (str_replace("'","",$param['add_age']));
                                                                                                $param['add_birthplace']               = (str_replace("'","",$param['add_birthplace']));
                                                                                                $param['add_emergency']                = (str_replace("'","",$param['add_emergency']));
                                                                                                $param['add_relationship']             = (str_replace("'","",$param['add_relationship']));
                                                                                                $param['add_emeradd']                  = (str_replace("'","",$param['add_emeradd']));
                                                                                                $param['add_emernum']                  = (str_replace("'","",$param['add_emernum']));
                                                                                                $param['add_height']                   = (str_replace("'","",$param['add_height']));
                                                                                                $param['add_weight']                   = (str_replace("'","",$param['add_weight']));
                                                                                                $param['add_cpnum']                    = (str_replace("'","",$param['add_cpnum']));
                                                                                                $param['add_civil_status']             = (str_replace("'","",$param['add_civil_status']));
                                                                                                $param['add_spouse']                   = (str_replace("'","",$param['add_spouse']));
                                                                                                $param['add_spouse_add']               = (str_replace("'","",$param['add_spouse_add']));
                                                                                                $param['add_supported']                = (str_replace("'","",$param['add_supported']));
                                                                                                $param['add_supp_rel']                 = (str_replace("'","",$param['add_supp_rel']));
                                                                                                $param['add_work_desire']              = (str_replace("'","",$param['add_work_desire']));
                                                                                                $param['add_sal_exp']                  = (str_replace("'","",$param['add_sal_exp']));
                                                                                                $param['add_intro']                    = (str_replace("'","",$param['add_intro']));
                                                                                                $param['add_hob_rec']                  = (str_replace("'","",$param['add_hob_rec']));
                                                                                                $param['add_elem_scho']                = (str_replace("'","",$param['add_elem_scho']));
                                                                                                $param['add_elem_year']                = (str_replace("'","",$param['add_elem_year']));
                                                                                                $param['add_high_scho']                = (str_replace("'","",$param['add_high_scho']));
                                                                                                $param['add_high_year']                = (str_replace("'","",$param['add_high_year']));
                                                                                                $param['add_coll_scho']                = (str_replace("'","",$param['add_coll_scho']));
                                                                                                $param['add_coll_year']                = (str_replace("'","",$param['add_coll_year']));
                                                                                                $param['add_deg_scho']                 = (str_replace("'","",$param['add_deg_scho']));
                                                                                                $param['add_deg_year']                 = (str_replace("'","",$param['add_deg_year']));
                                                                                                $param['add_vo_scho']                  = (str_replace("'","",$param['add_vo_scho']));
                                                                                                $param['add_vo_year']                  = (str_replace("'","",$param['add_vo_year']));
                                                                                                $param['add_prev_emp']                 = (str_replace("'","",$param['add_prev_emp']));
                                                                                                $param['add_prev_add']                 = (str_replace("'","",$param['add_prev_add']));
                                                                                                $param['add_from']                     = (str_replace("'","",$param['add_from']));
                                                                                                $param['add_to']                       = (str_replace("'","",$param['add_to']));
                                                                                                $param['add_salar']                    = (str_replace("'","",$param['add_salar']));
                                                                                                $param['add_work_done']                = (str_replace("'","",$param['add_work_done']));
                                                                                                $param['add_reas_leav']                = (str_replace("'","",$param['add_reas_leav']));
                                                                                                $param['add_sss']                      = (str_replace("'","",$param['add_sss']));
                                                                                                $param['add_philhealth']               = (str_replace("'","",$param['add_philhealth']));
                                                                                                $param['add_pagibig']                  = (str_replace("'","",$param['add_pagibig']));
                                                                                                $param['add_tax']                      = (str_replace("'","",$param['add_tax']));



                                                                                                $Qry            = new Query();  
                                                                                                $Qry->table     = "lgsa_employee";
                                                                                                $Qry->selected  = "lgsa_employee_profpic,
                                                                                                                lgsa_guard_employee_id,
                                                                                                                lgsa_guard_firstname,
                                                                                                                lgsa_guard_middlename,
                                                                                                                lgsa_guard_lastname,
                                                                                                                lgsa_guard_suffix,
                                                                                                                lgsa_guard_present_address,
                                                                                                                lgsa_guard_provincial_address,
                                                                                                                lgsa_guard_gender,
                                                                                                                lgsa_guard_birthdate,
                                                                                                                lgsa_guard_age,
                                                                                                                lgsa_guard_birthplace,
                                                                                                                lgsa_guard_incase_emergency,
                                                                                                                lgsa_guard_emergency_relationship,
                                                                                                                lgsa_guard_emergency_address,
                                                                                                                lgsa_guard_emergency_cp_num,
                                                                                                                lgsa_guard_height,
                                                                                                                lgsa_guard_weight,
                                                                                                                lgsa_guard_cp_num,
                                                                                                                lgsa_guard_marital_stat,
                                                                                                                lgsa_guard_name_spouse,
                                                                                                                lgsa_guard_name_spouse_address,
                                                                                                                lgsa_guard_person_supported,
                                                                                                                lgsa_guard_person_supported_rel,
                                                                                                                lgsa_guard_work_desire,
                                                                                                                lgsa_guard_expected_salary,
                                                                                                                lgsa_guard_introduce,
                                                                                                                lgsa_guard_hobby_recreation,
                                                                                                                lgsa_guard_elem_school,
                                                                                                                lgsa_guard_elem_year,
                                                                                                                lgsa_guard_high_school,
                                                                                                                lgsa_guard_high_year,
                                                                                                                lgsa_guard_coll_school,
                                                                                                                lgsa_guard_coll_year,
                                                                                                                lgsa_guard_deg_school,
                                                                                                                lgsa_guard_deg_year,
                                                                                                                lgsa_guard_voc_school,
                                                                                                                lgsa_guard_voc_year,
                                                                                                                lgsa_guard_previous_employer,
                                                                                                                lgsa_guard_previous_employer_add,
                                                                                                                lgsa_guard_employment_from,
                                                                                                                lgsa_guard_employment_to,
                                                                                                                lgsa_guard_employment_salary,
                                                                                                                lgsa_guard_work_done,
                                                                                                                lgsa_guard_reason_living,
                                                                                                                lgsa_guard_sss,
                                                                                                                lgsa_guard_philhealth,
                                                                                                                lgsa_guard_pagibig,
                                                                                                                lgsa_guard_tin,
                                                                                                                lgsa_employee_status,
                                                                                                                lgsa_employee_date_hired,
                                                                                                                lgsa_guard_client_id,
                                                                                                                is_created";
                                                                                                $Qry->fields    = "'".$pp."',
                                                                                                                '".$param['add_employeeid']."',
                                                                                                                '".$param['add_firstname']."',
                                                                                                                '".$param['add_middlename']."',
                                                                                                                '".$param['add_lastname']."',
                                                                                                                '".$param['add_suffix']."',
                                                                                                                '".$param['add_present_address']."',
                                                                                                                '".$param['add_provincial_address']."',
                                                                                                                '".$param['add_gender']."',
                                                                                                                '".$param['add_birthdate']."',
                                                                                                                '".$param['add_age']."',
                                                                                                                '".$param['add_birthplace']."',
                                                                                                                '".$param['add_emergency']."',
                                                                                                                '".$param['add_relationship']."',
                                                                                                                '".$param['add_emeradd']."',
                                                                                                                '".$param['add_emernum']."',
                                                                                                                '".$param['add_height']."',
                                                                                                                '".$param['add_weight']."',
                                                                                                                '".$param['add_cpnum']."',
                                                                                                                '".$param['add_civil_status']."',
                                                                                                                '".$param['add_spouse']."',
                                                                                                                '".$param['add_spouse_add']."',
                                                                                                                '".$param['add_supported']."',
                                                                                                                '".$param['add_supp_rel']."',
                                                                                                                '".$param['add_work_desire']."',
                                                                                                                '".$param['add_sal_exp']."',
                                                                                                                '".$param['add_intro']."',
                                                                                                                '".$param['add_hob_rec']."',
                                                                                                                '".$param['add_elem_scho']."',
                                                                                                                '".$param['add_elem_year']."',
                                                                                                                '".$param['add_high_scho']."',
                                                                                                                '".$param['add_high_year']."',
                                                                                                                '".$param['add_coll_scho']."',
                                                                                                                '".$param['add_coll_year']."',
                                                                                                                '".$param['add_deg_scho']."',
                                                                                                                '".$param['add_deg_year']."',
                                                                                                                '".$param['add_vo_scho']."',
                                                                                                                '".$param['add_vo_year']."',
                                                                                                                '".$param['add_prev_emp']."',
                                                                                                                '".$param['add_prev_add']."',
                                                                                                                '".$param['add_from']."',
                                                                                                                '".$param['add_to']."',
                                                                                                                '".$param['add_salar']."',
                                                                                                                '".$param['add_work_done']."',
                                                                                                                '".$param['add_reas_leav']."',
                                                                                                                '".$param['add_sss']."',
                                                                                                                '".$param['add_philhealth']."',
                                                                                                                '".$param['add_pagibig']."',
                                                                                                                '".$param['add_tax']."',
                                                                                                                'Applicant',
                                                                                                                '".$param['add_date_hired']."',
                                                                                                                '0',
                                                                                                                '".$datetime."'";

                                                                                                $checke             = $Qry->_insert($con);
                                                                                                // echo $Qry->fields;
                                                                                                // return;

                                                                                                if($checke){

                                                                                                    // upload profile pic
                                                                                                    if( array_key_exists('file',$_FILES) ){                                                                             
                                                                                                        $folder_path    = $param['targetPath'];
                                                                                                        $name           = $_FILES['file']['name'];
                                                                                                        $t              = strtotime($date).time();  
                                                                                                        $extMove        = pathinfo($name, PATHINFO_EXTENSION);
                                                                                                        $save_name      = $param['add_employeeid'].'.'.$extMove; 
                                                                                                        move_uploaded_file($_FILES["file"]["tmp_name"], $folder_path.$save_name);
                                                                                                    }

                                                                                                    $return = json_encode(array("status"=>"success"));

                                                                                                }else{
                                                                                                    $return = json_encode(array('status'=>'error','insert','sa', mysqli_error($con)));
                                                                                                }

                                                                                            // }else{
                                                                                            //     $return = json_encode(array("status"=>"nohsyr"));
                                                                                            // }
                                                                                        }else{
                                                                                            $return = json_encode(array("status"=>"nohsscho"));
                                                                                        }
                                                                                    // }else{
                                                                                    //     $return = json_encode(array("status"=>"noelemyr"));
                                                                                    // }
                                                                                }else{
                                                                                    $return = json_encode(array("status"=>"noelemscho"));
                                                                                }
                                                                            // }else{
                                                                            //     $return = json_encode(array("status"=>"nohobrec"));
                                                                            // }

                                                                        }else{
                                                                            $return = json_encode(array("status"=>"nosalexp"));
                                                                        }
                                                                    // }else{
                                                                    //     $return = json_encode(array("status"=>"noworkdes"));
                                                                    // }
                                                                    
                                                                }else{
                                                                    $return = json_encode(array("status"=>"nocivstat"));
                                                                }
                                                                
                                                            }else{
                                                                $return = json_encode(array("status"=>"nocpnum"));
                                                            }
                                                            
                                                        }else{
                                                            $return = json_encode(array("status"=>"noemernum"));
                                                        }

                                                    }else{
                                                        $return = json_encode(array("status"=>"noemeradd"));
                                                    }

                                                }else{
                                                    $return = json_encode(array("status"=>"norel"));
                                                }

                                            }else{
                                                $return = json_encode(array("status"=>"noemer"));
                                            }

                                        }else{
                                            $return = json_encode(array("status"=>"nobirthplace"));
                                        }

                                    }else{
                                        $return = json_encode(array("status"=>"noage"));
                                    }

                                }else{
                                    $return = json_encode(array("status"=>"nobirthdate"));
                                }

                            }else{
                                $return = json_encode(array("status"=>"nogender"));
                            }

                        }else{
                            $return = json_encode(array("status"=>"nopresentaddress"));
                        }

                    }else{
                        $return = json_encode(array("status"=>"nolastname"));
                    }
                }else{
                    $return = json_encode(array("status"=>"nomiddlename"));
                }
            }else{
             $return = json_encode(array("status"=>"nofirstname"));
            }
        }else{
            $return = json_encode(array("status"=>"noemployeeid"));
        }
        
}else{
        $return = json_encode(array("status"=>"notloggedin"));
    }

print $return;
mysqli_close($con);

?>