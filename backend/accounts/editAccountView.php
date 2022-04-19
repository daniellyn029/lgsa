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

    if(!empty($param['edit_employeeid123'])){
        if(!empty($param['edit_firstname'])){
            if(!empty($param['edit_middlename'])){
                if(!empty($param['edit_lastname'])){
                    if(!empty($param['edit_username'])){
                        if(!empty($param['edit_password'])){
                            // if(!empty($param['edit_suffix'])){
                                if(!empty($param['edit_address'])){
                                    if(!empty($param['edit_cp'])){
                                        if(!empty($param['edit_gender'])){
                                            if(!empty($param['edit_birthdate'])){

                                                if ((filter_var($param['edit_email_address'], FILTER_VALIDATE_EMAIL) && (!empty($param['edit_email_address']))) || (empty($param['edit_email_address']))) {

                                                    if(!empty($param['edit_account_role'])){
                                                        if(!empty($param['edit_email_status'])){
                                                            if(!empty($param['edit_account_status'])){
                                                                
                                                                $pp='';
                                                                if( array_key_exists('file',$_FILES) ){
                                                                    $extMove = pathinfo($_FILES['file']['name'], PATHINFO_EXTENSION);
                                                                    $pp    = $param['edit_employeeid123'].".".$extMove;
                                                                }

                                                                //UPDATE TO DATABASE
                                                                $Qry            =   new Query();    
                                                                $Qry->table     =   "lgsa_user";
                                                                $Qry->selected  =   "lgsa_user_employee_id       = '".$param['edit_employeeid123']."',
                                                                                    lgsa_user_firstname         = '".$param['edit_firstname']."',
                                                                                    lgsa_user_middlename        = '".$param['edit_middlename']."',
                                                                                    lgsa_user_lastname          = '".$param['edit_lastname']."',
                                                                                    lgsa_user_suffix            = '".$param['edit_suffix']."',
                                                                                    lgsa_user_username          = '".$param['edit_username']."',
                                                                                    lgsa_user_password          = '".$param['edit_password']."',
                                                                                    lgsa_user_email_address     = '".$param['edit_email_address']."',
                                                                                    lgsa_user_contact_number    = '".$param['edit_cp']."',
                                                                                    lgsa_user_address           = '".$param['edit_address']."',
                                                                                    lgsa_user_birthdate         = '".$param['edit_birthdate']."',
                                                                                    lgsa_user_gender            = '".$param['edit_gender']."',
                                                                                    lgsa_user_role              = '".$param['edit_account_role']."',
                                                                                    lgsa_email_status           = '".$param['edit_email_status']."',
                                                                                    lgsa_account_status         = '".$param['edit_account_status']."'";             

                                                                if( !empty( $pp ) ){
                                                                    $Qry->selected  = $Qry->selected . ",lgsa_user_profile_pic='".$pp."'";
                                                                }
                                                                                    $Qry->fields    = "lgsa_user_id='".$param['edit_id']."'";
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
                                                                        $save_name      = $param['edit_employeeid123'].'.'.$extMove;    
                                                                        move_uploaded_file($_FILES["file"]["tmp_name"], $folder_path.$save_name);
                                                                    }

                                                                    $return = json_encode(array("status"=>"success"));
                                                                    
                                                                }else{
                                                                    $return = json_encode(array("status"=>"error",mysqli_error($con)));
                                                                }

                                                            }else{
                                                                $return = json_encode(array("status"=>"noaccstat"));
                                                            }
                                                        }else{
                                                            $return = json_encode(array("status"=>"noemastat"));
                                                        }
                                                    }else{
                                                        $return = json_encode(array("status"=>"noaccrol"));
                                                    }
                                                }else{
                                                    $return = json_encode(array("status"=>"novalema"));
                                                }    
                                            }else{
                                                $return = json_encode(array("status"=>"nobirt"));
                                            }
                                        }else{
                                            $return = json_encode(array("status"=>"nogen"));
                                        }
                                    }else{
                                        $return = json_encode(array("status"=>"nocp"));
                                    }
                                }else{
                                    $return = json_encode(array("status"=>"noadd"));
                                }
                            // }else{
                            //     $return = json_encode(array("status"=>"asdasdasdasd"));
                            // }
                        }else{
                            $return = json_encode(array("status"=>"nopas"));
                        }
                    }else{
                        $return = json_encode(array("status"=>"nouse"));
                    }
                }else{
                    $return = json_encode(array("status"=>"nolas"));
                }
            }else{
                $return = json_encode(array("status"=>"nomid"));
            }
        }else{
            $return = json_encode(array("status"=>"nofir"));
        }
        
    }else{
        $return = json_encode(array("status"=>"noempid123"));
    }

}else{
    $return = json_encode(array("status"=>"notloggedin"));
}


print $return;
mysqli_close($con);


?>