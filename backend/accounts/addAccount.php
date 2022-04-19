<?php
require_once('../database.php');
require_once('../utils.php');
$conn = new connector();
$con = $conn->connect();

$param = $_POST;
$date = SysDate();
$time = SysTime();
$datetime = $date.' '.$time;


//Check if already logged in
if(!empty($param['accountuserid'])){

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
        $pp    = $param['add_employeeid123'].".".$extMove;
    }

    if ((filter_var($param['add_email_address'], FILTER_VALIDATE_EMAIL) && (!empty($param['add_email_address']))) || (empty($param['add_email_address']))) {
        if(!empty($param['add_employeeid123'])){
            if(!empty($param['add_firstname'])){
                if(!empty($param['add_middlename'])){
                    if(!empty($param['add_lastname'])){
                        if(!empty($param['add_username'])){
                            if(!empty($param['add_password'])){
                                if(!empty($param['add_address'])){
                                    if(!empty($param['add_cp'])){
                                        // if(!empty($param['add_account_role'])){
                                            if(!empty($param['add_gender'])){
                                                if(!empty($param['add_birthdate'])){
                                                    if(!empty($param['add_account_role'])){
                                                        if(!empty($param['add_email_status'])){
                                                            if(!empty($param['add_account_status'])){


                                                                //clean string
                                                                $param['add_employeeid123']               = (str_replace("'","",$param['add_employeeid123']));
                                                                $param['add_account_role']             = (str_replace("'","",$param['add_account_role']));
                                                                $param['add_username']                 = (str_replace("'","",$param['add_username']));
                                                                $param['add_password']                 = (str_replace("'","",$param['add_password']));
                                                                $param['add_firstname']                = (str_replace("'","",$param['add_firstname']));
                                                                $param['add_middlename']               = (str_replace("'","",$param['add_middlename']));
                                                                $param['add_lastname']                 = (str_replace("'","",$param['add_lastname']));
                                                                $param['add_suffix']                   = (str_replace("'","",$param['add_suffix']));    
                                                                $param['add_email_status']             = (str_replace("'","",$param['add_email_status']));
                                                                $param['add_account_status']           = (str_replace("'","",$param['add_account_status']));
                                                                $param['add_email_address']            = (str_replace("'","",$param['add_email_address']));
                                                                $param['add_cp']                       = (str_replace("'","",$param['add_cp']));
                                                                $param['add_address']                  = (str_replace("'","",$param['add_address']));
                                                                $param['add_birthdate']                = (str_replace("'","",$param['add_birthdate']));
                                                                $param['add_gender']                   = (str_replace("'","",$param['add_gender']));


                                                                $Qry            = new Query();  
                                                                $Qry->table     = "lgsa_user";
                                                                $Qry->selected  = "lgsa_user_profile_pic,
                                                                                lgsa_user_employee_id,
                                                                                lgsa_user_role,
                                                                                lgsa_user_username,
                                                                                lgsa_user_password,
                                                                                lgsa_user_firstname,
                                                                                lgsa_user_middlename,
                                                                                lgsa_user_lastname,
                                                                                lgsa_email_status,
                                                                                lgsa_account_status,
                                                                                lgsa_user_email_address,
                                                                                lgsa_user_contact_number,
                                                                                lgsa_user_address,
                                                                                lgsa_user_birthdate,
                                                                                lgsa_user_gender,
                                                                                lgsa_user_suffix,
                                                                                is_created";
                                                                                $Qry->fields    = "'".$pp."',
                                                                                '".$param['add_employeeid123']."',
                                                                                '".$param['add_account_role']."',
                                                                                '".$param['add_username']."',
                                                                                '".$param['add_password']."',
                                                                                '".$param['add_firstname']."',
                                                                                '".$param['add_middlename']."',
                                                                                '".$param['add_lastname']."',
                                                                                '".$param['add_email_status']."',
                                                                                '".$param['add_account_status']."',
                                                                                '".$param['add_email_address']."',
                                                                                '".$param['add_cp']."',
                                                                                '".$param['add_address']."',
                                                                                '".$param['add_birthdate']."',
                                                                                '".$param['add_gender']."',
                                                                                '".$param['add_suffix']."',
                                                                                '".$datetime."'";

                                                                                $checke             = $Qry->_insert($con);

                                                                if($checke){

                                                                    // upload profile pic
                                                                    if( array_key_exists('file',$_FILES) ){                                                                             
                                                                        $folder_path    = $param['targetPath'];
                                                                        $name           = $_FILES['file']['name'];
                                                                        $t              = strtotime($date).time();  
                                                                        $extMove        = pathinfo($name, PATHINFO_EXTENSION);
                                                                        $save_name      = $param['add_employeeid123'].'.'.$extMove; 
                                                                        move_uploaded_file($_FILES["file"]["tmp_name"], $folder_path.$save_name);
                                                                    }

                                                                    $return = json_encode(array("status"=>"success"));

                                                                }else{
                                                                    $return = json_encode(array('status'=>'error','insert','sa', mysqli_error($con)));
                                                                }
                                                            }else{
                                                                $return = json_encode(array("status"=>"noaccountstat"));
                                                            }
                                                        }else{
                                                            $return = json_encode(array("status"=>"noemailstat"));
                                                        }
                                                        
                                                    }else{
                                                        $return = json_encode(array("status"=>"noaccountrole"));
                                                    }

                                                }else{
                                                    $return = json_encode(array("status"=>"nobday"));
                                                }
                                            }else{
                                                $return = json_encode(array("status"=>"nogender"));
                                            }
                                        // }else{
                                        //     $return = json_encode(array("status"=>"noaccountrole"));
                                        // }
                                    }else{
                                        $return = json_encode(array("status"=>"nocp"));
                                    }
                                }else{
                                    $return = json_encode(array("status"=>"noaddress"));
                                }
                            }else{
                                $return = json_encode(array("status"=>"nopassword"));
                            }
                        }else{
                            $return = json_encode(array("status"=>"nousername"));
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
            $return = json_encode(array("status"=>"noempid"));
        }
    }else{
        $return = json_encode(array("status"=>"invalidemail"));
    }
}else{
    $return = json_encode(array("status"=>"notloggedin"));
}




              
print $return;
mysqli_close($con);

?>