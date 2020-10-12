import React, {Component} from 'react';
import {View, Text, Button, StyleSheet, PermissionsAndroid} from 'react-native';

// Geolocation Library 추가하기 ########################
//   $ npm install react-native-geolocation-service
// #####################################################


//  Android에서 작업시에 퍼미션 없으면 에러 #################################################################
// [프로젝트폴더]/android/app/src/main 폴더 안에 있는  AndroidManifest.xml 에 퍼미션 추가 

//    <uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />

//  !!!! 현재 위 퍼미션만 주면 동적퍼미션은 안됨!!  
// ##########################################################################################################

import Geolocation from 'react-native-geolocation-service';

export default class Main extends Component{

    constructor(){
        super();
        this.state= {
            currPos: {latitude: 0.0, longitude: 0.0}, //최초 현재좌표객체 [위도, 경도]                   
        }

       
    }

    render(){
        return (

            
            <View style={styles.root}>                
                {/* 1) 현재 내위치 좌표(위도,경도) 표시하기 */}
                <Button title="get my location" onPress={this.clickBtn}></Button>

                {/* 2) 내 위치 실시간 업데이트 */}
                <View style={ {flexDirection:'row', justifyContent:'space-between', marginTop:16, } }>
                    <Button title="watch my location : update" onPress={this.clickBtn2} color="green"></Button>
                    <Button title="stop my location" onPress={this.clickBtn3} color="red"></Button>
                </View>
                

                <View style={styles.textArea}>
                    <Text style={styles.text}>latitude : {this.state.currPos.latitude}</Text>
                    <Text style={styles.text}>longitude : {this.state.currPos.longitude}</Text>
                </View>                
            </View>
        );
    }

    //1)실습 버튼 클릭 콜백메소드
    clickBtn=()=>{
        // Geolocation객체에게 현재 위치좌표 얻어오기 [ getCurrentPosition( success, error ) : 파라미터 2개( 성공시 자동 호출되는 콜백함수, 실패시 호출되는 콜백함수 ) ] 
        // getCurrentPosition(successCallback, ?errorCallback, ?options) 
        Geolocation.getCurrentPosition( ( position )=>{
            //파라미터로 전달된 info 객체 안에 좌표(coordinate)정보가 있음.
            //좌표정보를 Text에 보여주기 위해 state변수의 currPos 값 변경
            this.setState( {currPos: position.coords} );       

        }, ( error )=>{
            alert('error : '+ error.message ); //퍼미션 없으면 에러...[퍼미션변경하면 다시 run해야함 : 동적퍼미션이 안되면 설정에 가서 직정 퍼미션 allow]
        });

    }   

    //2)실습 버튼 클릭 콜백메소드 [테스트 할때 수정된 내역이 있으면 hot reload로 하면 동작안됨. 다시 run시키는 것이 확실함.-why? 이전 테스트에서 watch 후에 clear를 안해준 상태에서 hot reload하면 이미 watch중이어서 실행을 안함]
    clickBtn2=()=>{         

        //혹시 이전에 watch 중일 수도 있어서 있다면 지우도록... (id가 지정된 적이 없을때는 그냥 아무 동작안함)
        Geolocation.clearWatch( this.state.id );

        const id= Geolocation.watchPosition( 
            (position)=>{               
                this.setState( { currPos: position.coords } ); 
            },
            (error)=>{
                alert('error : ' + error.message);
            }
        ); 
        
        // state에 watch ID값 저장 (이렇게 변수명으로 값을 주면.. 자동으로 변수명이 'key;가 되고 값이 'value'가 됨)
        this.setState({id});
    }

    clickBtn3=()=>{
        Geolocation.clearWatch( this.state.id );
        this.setState( { currPos: {latitude: 0.0, longitude: 0.0} } );        
    }



    //동적퍼미션 ##############################################
    async  requestLocationPermission(){
        try {
            //퍼미션 요청 다이얼로그 보이도록 요청
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                // 다이얼로그의 제목 및 메세지 설정 옵션
                // {
                // 'title': 'Example App',
                // 'message': 'Example App access to your location '
                // }
            );
            
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                console.log("You can use the location");
                alert("You can use the location");
            } else {
                console.log("location permission denied");
                alert("Location permission denied");
            }
        } catch (err) {
            console.warn(err);
        }
    }

    async componentDidMount() {        
        await this.requestLocationPermission();
    }
    // ###########################################################

}



const styles= StyleSheet.create({
    root: {flex:1, padding:16},
    textArea: {flex:1, justifyContent:'center', alignItems:'center',},
    text: {fontWeight:'bold', fontSize:20, padding:8,},
});