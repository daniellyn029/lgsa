<?php
require_once('../database.php');
require_once('../utils.php');
require_once('../function/password.php');
$conn = new connector();    
$con = $conn->connect();

$param = $_POST;
$date=SysDate();
$time=SysTime();


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

    if(!empty($param['edit_employeeid'])){
        if(!empty($param['edit_firstname'])){
            if(!empty($param['edit_middlename'])){
                if(!empty($param['edit_lastname'])){
                    if(!empty($param['edit_present_address'])){
                        if(!empty($param['edit_gender'])){
                            if(!empty($param['edit_birthdate'])){
                                if(!empty($param['edit_age'])){
                                    if(!empty($param['edit_birthplace'])){
                                        if(!empty($param['edit_emergency'])){
                                            if(!empty($param['edit_relationship'])){
                                                if(!empty($param['edit_emeradd'])){
                                                    if(!empty($param['edit_emernum'])){
                                                        if(!empty($param['edit_cpnum'])){
                                                            if(!empty($param['edit_civil_status'])){
                                                                if(!empty($param['edit_work_desire'])){
                                                                    if(!empty($param['edit_sal_exp'])){
                                                                        if(!empty($param['edit_hob_rec'])){
                                                                            if(!empty($param['edit_elem_scho'])){
                                                                                if(!empty($param['edit_elem_year'])){
                                                                                    if(!empty($param['edit_high_scho'])){
                                                                                        if(!empty($param['edit_high_year'])){


                                                                                            //clean string
                                                                                            $param['edit_employeeid']                = (str_replace("'","",$param['edit_employeeid']));
                                                                                            $param['edit_firstname']                = (str_replace("'","",$param['edit_firstname']));
                                                                                            $param['edit_middlename']               = (str_replace("'","",$param['edit_middlename']));
                                                                                            $param['edit_lastname']                 = (str_replace("'","",$param['edit_lastname']));
                                                                                            $param['edit_suffix']                   = (str_replace("'","",$param['edit_suffix']));
                                                                                            $param['edit_present_address']          = (str_replace("'","",$param['edit_present_address']));
                                                                                            $param['edit_provincial_address']       = (str_replace("'","",$param['edit_provincial_address']));
                                                                                            $param['edit_gender']                   = (str_replace("'","",$param['edit_gender']));
                                                                                            $param['edit_birthdate']                = (str_replace("'","",$param['edit_birthdate']));
                                                                                            $param['edit_age']                      = (str_replace("'","",$param['edit_age']));
                                                                                            $param['edit_birthplace']               = (str_replace("'","",$param['edit_birthplace']));
                                                                                            $param['edit_emergency']                = (str_replace("'","",$param['edit_emergency']));
                                                                                            $param['edit_relationship']             = (str_replace("'","",$param['edit_relationship']));
                                                                                            $param['edit_emeradd']                  = (str_replace("'","",$param['edit_emeradd']));
                                                                                            $param['edit_emernum']                  = (str_replace("'","",$param['edit_emernum']));
                                                                                            $param['edit_height']                   = (str_replace("'","",$param['edit_height']));
                                                                                            $param['edit_weight']                   = (str_replace("'","",$param['edit_weight']));
                                                                                            $param['edit_cpnum']                    = (str_replace("'","",$param['edit_cpnum']));
                                                                                            $param['edit_civil_status']             = (str_replace("'","",$param['edit_civil_status']));
                                                                                            $param['edit_spouse']                   = (str_replace("'","",$param['edit_spouse']));
                                                                                            $param['edit_spouse_add']               = (str_replace("'","",$param['edit_spouse_add']));
                                                                                            $param['edit_supported']                = (str_replace("'","",$param['edit_supported']));
                                                                                            $param['edit_supp_rel']                 = (str_replace("'","",$param['edit_supp_rel']));
                                                                                            $param['edit_work_desire']              = (str_replace("'","",$param['edit_work_desire']));
                                                                                            $param['edit_sal_exp']                  = (str_replace("'","",$param['edit_sal_exp']));
                                                                                            $param['edit_intro']                    = (str_replace("'","",$param['edit_intro']));
                                                                                            $param['edit_hob_rec']                  = (str_replace("'","",$param['edit_hob_rec']));
                                                                                            $param['edit_elem_scho']                = (str_replace("'","",$param['edit_elem_scho']));
                                                                                            $param['edit_elem_year']                = (str_replace("'","",$param['edit_elem_year']));
                                                                                            $param['edit_high_scho']                = (str_replace("'","",$param['edit_high_scho']));
                                                                                            $param['edit_high_year']                = (str_replace("'","",$param['edit_high_year']));
                                                                                            $param['edit_coll_scho']                = (str_replace("'","",$param['edit_coll_scho']));
                                                                                            $param['edit_coll_year']                = (str_replace("'","",$param['edit_coll_year']));
                                                                                            $param['edit_deg_scho']                 = (str_replace("'","",$param['edit_deg_scho']));
                                                                                            $param['edit_deg_year']                 = (str_replace("'","",$param['edit_deg_year']));
                                                                                            $param['edit_vo_scho']                  = (str_replace("'","",$param['edit_vo_scho']));
                                                                                            $param['edit_vo_year']                  = (str_replace("'","",$param['edit_vo_year']));
                                                                                            $param['edit_prev_emp']                 = (str_replace("'","",$param['edit_prev_emp']));
                                                                                            $param['edit_prev_add']                 = (str_replace("'","",$param['edit_prev_add']));
                                                                                            $param['edit_from']                     = (str_replace("'","",$param['edit_from']));
                                                                                            $param['edit_to']                       = (str_replace("'","",$param['edit_to']));
                                                                                            $param['edit_salar']                    = (str_replace("'","",$param['edit_salar']));
                                                                                            $param['edit_work_done']                = (str_replace("'","",$param['edit_work_done']));
                                                                                            $param['edit_reas_leav']                = (str_replace("'","",$param['edit_reas_leav']));
                                                                                            $param['edit_sss']                      = (str_replace("'","",$param['edit_sss']));
                                                                                            $param['edit_philhealth']               = (str_replace("'","",$param['edit_philhealth']));
                                                                                            $param['edit_pagibig']                  = (str_replace("'","",$param['edit_pagibig']));
                                                                                            $param['edit_tax']                      = (str_replace("'","",$param['edit_tax']));


                                                                                            $pp='';
                                                                                            if( array_key_exists('file',$_FILES) ){
                                                                                                $extMove = pathinfo($_FILES['file']['name'], PATHINFO_EXTENSION);
                                                                                                $pp    = $param['edit_employeeid'].".".$extMove;
                                                                                            }
                                                                                        
                                                                                            //UPDATE TO DATABASE
                                                                                            $Qry            =   new Query();    
                                                                                            $Qry->table     =   "lgsa_employee";
                                                                                            $Qry->selected  =   "lgsa_guard_employee_id         = '".$param['edit_employeeid']."',
                                                                                                                lgsa_guard_firstname            = '".$param['edit_firstname']."',
                                                                                                                lgsa_guard_middlename           = '".$param['edit_middlename']."',
                                                                                                                lgsa_guard_lastname             = '".$param['edit_lastname']."',
                                                                                                                lgsa_guard_suffix               = '".$param['edit_suffix']."',
                                                                                                                lgsa_guard_present_address      = '".$param['edit_present_address']."',
                                                                                                                lgsa_guard_provincial_address   = '".$param['edit_provincial_address']."',
                                                                                                                lgsa_guard_gender               = '".$param['edit_gender']."',
                                                                                                                lgsa_guard_birthdate            = '".$param['edit_birthdate']."',
                                                                                                                lgsa_guard_age                  = '".$param['edit_age']."',
                                                                                                                lgsa_guard_birthplace           = '".$param['edit_birthplace']."',
                                                                                                                lgsa_guard_incase_emergency     = '".$param['edit_emergency']."',
                                                                                                                lgsa_guard_emergency_relationship= '".$param['edit_relationship']."',
                                                                                                                lgsa_guard_emergency_address     = '".$param['edit_emeradd']."',
                                                                                                                lgsa_guard_emergency_cp_num     = '".$param['edit_emernum']."',
                                                                                                                lgsa_guard_height               = '".$param['edit_height']."',
                                                                                                                lgsa_guard_weight               = '".$param['edit_weight']."',
                                                                                                                lgsa_guard_cp_num               = '".$param['edit_cpnum']."',
                                                                                                                lgsa_guard_marital_stat         = '".$param['edit_civil_status']."',
                                                                                                                lgsa_guard_name_spouse          = '".$param['edit_spouse']."',
                                                                                                                lgsa_guard_name_spouse_address  = '".$param['edit_spouse_add']."',
                                                                                                                lgsa_guard_person_supported     = '".$param['edit_supported']."',
                                                                                                                lgsa_guard_person_supported_rel = '".$param['edit_supp_rel']."',
                                                                                                                lgsa_guard_work_desire          = '".$param['edit_work_desire']."',
                                                                                                                lgsa_guard_expected_salary      = '".$param['edit_sal_exp']."',
                                                                                                                lgsa_guard_introduce            = '".$param['edit_intro']."',
                                                                                                                lgsa_guard_hobby_recreation     = '".$param['edit_hob_rec']."',
                                                                                                                lgsa_guard_elem_school          = '".$param['edit_elem_scho']."',
                                                                                                                lgsa_guard_elem_year            = '".$param['edit_elem_year']."',
                                                                                                                lgsa_guard_high_school          = '".$param['edit_high_scho']."',
                                                                                                                lgsa_guard_high_year            = '".$param['edit_high_year']."',
                                                                                                                lgsa_guard_coll_school          = '".$param['edit_coll_scho']."',
                                                                                                                lgsa_guard_coll_year            = '".$param['edit_coll_year']."',
                                                                                                                lgsa_guard_deg_school           = '".$param['edit_deg_scho']."',
                                                                                                                lgsa_guard_deg_year             = '".$param['edit_deg_year']."',
                                                                                                                lgsa_guard_voc_school           = '".$param['edit_vo_scho']."',
                                                                                                                lgsa_guard_voc_year             = '".$param['edit_vo_year']."',
                                                                                                                lgsa_guard_previous_employer    = '".$param['edit_prev_emp']."',
                                                                                                                lgsa_guard_previous_employer_add= '".$param['edit_prev_add']."',
                                                                                                                lgsa_guard_employment_from      = '".$param['edit_from']."',
                                                                                                                lgsa_guard_employment_to        = '".$param['edit_to']."',
                                                                                                                lgsa_guard_employment_salary    = '".$param['edit_salar']."',
                                                                                                                lgsa_guard_work_done            = '".$param['edit_work_done']."',
                                                                                                                lgsa_guard_reason_living        = '".$param['edit_reas_leav']."',
                                                                                                                lgsa_guard_sss                  = '".$param['edit_sss']."',
                                                                                                                lgsa_guard_philhealth           = '".$param['edit_philhealth']."',
                                                                                                                lgsa_guard_pagibig              = '".$param['edit_pagibig']."',
                                                                                                                lgsa_guard_tin                  = '".$param['edit_tax']."'";
                                                                                        
                                                                                            if( !empty( $pp ) ){
                                                                                                $Qry->selected  = $Qry->selected . ",lgsa_employee_profpic='".$pp."'";
                                                                                            }
                                                                                                                $Qry->fields    = "lgsa_employee_id='".$param['edit_id']."'";
                                                                                                                $checke         = $Qry->_update($con);
                                                                                        
                                                                                            if($checke){

                                                                                                //upload profile pic
                                                                                                if( array_key_exists('file',$_FILES) ){       
                                                                                                //delete existing profile pic                                                                        
                                                                                                    if( !empty( $param['edit_picFile'] ) ){ 
                                                                                                        unlink('../../frontend/assets/images/profile_pic/'.$param['edit_picFile']); //DELETE 
                                                                                                    }
                                                                                                    //save new profile pic
                                                                                                    $folder_path    = $param['targetPath'];
                                                                                                    $name           = $_FILES['file']['name'];
                                                                                                    $t              = strtotime($date).time();  
                                                                                                    $extMove        = pathinfo($name, PATHINFO_EXTENSION);
                                                                                                    $save_name      = $param['edit_employeeid'].'.'.$extMove;    
                                                                                                    move_uploaded_file($_FILES["file"]["tmp_name"], $folder_path.$save_name);
                                                                                                }
                                                                    
                                                                                                $return = json_encode(array("status"=>"success"));
                                                                                                
                                                                                            }else{
                                                                                                $return = json_encode(array("status"=>"error",mysqli_error($con)));
                                                                                            }

                                                                                        }else{
                                                                                            $return = json_encode(array("status"=>"nohsyr"));
                                                                                        }
                                                                                    }else{
                                                                                        $return = json_encode(array("status"=>"nohsscho"));
                                                                                    }
                                                                                }else{
                                                                                    $return = json_encode(array("status"=>"noelemyr"));
                                                                                }
                                                                            }else{
                                                                                $return = json_encode(array("status"=>"noelemscho"));
                                                                            }
                                                                        }else{
                                                                            $return = json_encode(array("status"=>"nohobrec"));
                                                                        }

                                                                    }else{
                                                                        $return = json_encode(array("status"=>"nosalexp"));
                                                                    }
                                                                }else{
                                                                    $return = json_encode(array("status"=>"noworkdes"));
                                                                }
                                                                
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