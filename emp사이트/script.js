getStatistics(); //함수호출
getEmp(1); //함수호출
//사원통계정보 불러오기

function getStatistics(){
//AJAX : HTML과 백엔드 소통을 도와주는 다리
$.ajax({
    url : "http://localhost:8080/api/v2/empt/statistics",//백엔드 경로
    type : 'GET', //HTTP 메소드
    datatype : 'Json', //프론트에서 백엔드 결과를 Json으로 받겠다.
    success : function(response){ //요청이 성공하면!
        console.log(response);//결과확인
        $('#studentsCnt').append(response.empCount);
        $('#boardCnt').append(response.empSalAvg);
        $('#writerCnt').append(response.deptCount);
        $('#viewsCnt').append(response.empCommSum);
        }
});
}
//사원추가
function setEmp(){
    var empno = $('#i_empno').val();
    var ename = $('#i_ename').val();
    var job = $('#i_job').val();
    var sal = $('#i_sal').val();
    var comm = $('#i_comm').val();
//빈값체크 로직구현
if(empno == ''){
    alert('사원번호를 입력하세요.');
    $('#i_empno').focus();
    return false;
}
if(ename == ''){
    alert('사원이름을 입력하세요.');
    $('#i_ename').focus();
    return false;
}
if(job == ''){
    alert('담당업무를 입력하세요.');
    $('#i_job').focus();
    return false;
}
if(sal == ''){
    alert('급여를 입력하세요.');
    $('#i_sal').focus();
    return false;
}
if(comm == ''){
    alert('보너스를 입력하세요.');
    $('#i_comm').focus();
    return false;
}

var jsonData = {
    "empno" : empno,
    "ename" : ename,
    "job" : job,
    "sal" : sal,
    "comm" : comm}
$.ajax({
    url : "http://localhost:8080/api/v2/empt",//백엔드 경로
    type : 'POST', //HTTP 메소드
    contentType : 'application/json',
    dataType : 'json',
    data :  JSON.stringify(jsonData),//프론트에서 백엔드 결과를 Json으로 받겠다.
    success : function(response){ //요청이 성공하면!
       if (response>0){
            alert('사원이 등록 되었습니다.');
            location.reload();//자바스크립트에서 제공해주는 새로고침
       }else{
        alert("이미 가입된 사원번호입니다.");
       }
    }//결과확인       
    });
}

//전체 사원 조회하는 함수
function getEmp(pageNum){
    $.ajax({
        url : "http://localhost:8080/api/v2/empt?page="+pageNum,//백엔드 경로
        type : 'GET', //HTTP 메소드
        datatype : 'Json', //프론트에서 백엔드 결과를 Json으로 받겠다.
        success : function(response){ //요청이 성공하면!
            //배열하고 for문은 친구!!
            //response 배열
            $('#empData').empty();
            $('.pagination').empty();
            console.log(response);
            var html = '';
            for(var i=0; i<response.list.length;i++){
                html +='<tr onclick="getEmpByEmpno('+response.list[i].empno+')"><th>'+response.list[i].empno+'</th><th>'+response.list[i].ename+'</th><th>'+response.list[i].job+'</th><th>'+response.list[i].sal+'</th><th>'+response.list[i].hiredate+'</th><th>'+response.list[i].dname+'</th></tr>';               

            }
            //사원목록에 사원 데이터 바인딩(==사원목록 html에 데이터보여주기)
            //tbody태그 id :empData에 바인딩 하기             
            $('#empData').append(html);//바인딩 작업                
            var paginationHtml = '';
            if(response.hasPreviousPage){
                paginationHtml += '<a onclick="getEmp('+(pageNum-1)+')">Previous</a>';
            }

            for(var i=0; i<response.navigatepageNums.length;i++){
                var page = response.navigatepageNums[i];
                paginationHtml += '<a onclick="getEmp('+page+')">'+page+'</a>'
            }
            if(response.hasNextPage){
                paginationHtml += '<a onclick="getEmp('+(pageNum+1)+')">Next</a>';
              
            }
            $('.pagination').append(paginationHtml);//페이징 바인딩 작업!
        }
    });
}

//특정 사원 조회 함수
function getEmpByEmpno(empno){  
    console.log('클릭한 번호?'+empno);  
    $.ajax({
    url : "http://localhost:8080/api/v2/empt/empno/"+empno,//백엔드 경로
    type : 'GET', //HTTP 메소드
    datatype : 'Json', //프론트에서 백엔드 결과를 Json으로 받겠다.
    success : function(response){ //요청이 성공하면!
        console.log(response);//결과확인
        $('.update-popup').css('display','block');
        $('#u_empno').val(response.empno);
        $('#u_ename').val(response.ename);
        $('#u_job').val(response.job);
        $('#u_sal').val(response.sal);
        $('#u_comm').val(response.comm);
        }
    });
}
//사원 정보 수정(== insert)
function updateEmp(){
    var empno = $('#u_empno').val();
    var ename = $('#u_ename').val();
    var job = $('#u_job').val();
    var sal = $('#u_sal').val();
    var comm = $('#u_comm').val();

    var jsonData = {
        "empno" : empno,
        "ename" : ename,
        "job" : job,
        "sal" : sal,
        "comm" : comm
    }
    $.ajax({
        url : "http://localhost:8080/api/v2/empt",//백엔드 경로
        type : 'PATCH', //HTTP 메소드
        contentType : 'application/json',
        dataType : 'json',
        data :  JSON.stringify(jsonData),//프론트에서 백엔드 결과를 Json으로 받겠다.
        success : function(response){ //요청이 성공하면!
           if (response>0){
                alert('수정완료');
                location.reload();//자바스크립트에서 제공해주는 새로고침
           };//결과확인       
            }
        });
}
//사원 삭제
//데이터는 곧 자산
//실제로 기업에서는 데이터를 삭제하지 않고, 삭제 여부 컬럼을 추가해서 
//탈퇴한 회원은 Y 현재 회원은 N으로 관리한다.

function fireEmp(){
        var empno = $('#u_empno').val();
        var ename = $('#u_ename').val();       
        $.ajax({
            url : "http://localhost:8080/api/v2/empt/empno/"+empno,
            type : 'PATCH', //HTTP 메소드
            dataType : 'json',        
            success : function(response){ //요청이 성공하면!
               if (response>0){                   
                    alert(ename+'님 회원탈퇴');
                    location.reload();//자바스크립트에서 제공해주는 새로고침                
               }//결과확인      
            }
        });    
}
//엑셀 다운로드
function downloadExcelFile(){
    console.log('excel download 버튼 클릭');
    location.href='http://localhost:8080/excel/download'
}