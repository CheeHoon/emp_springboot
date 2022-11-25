getDept(1); //함수호출

//전체 사원 조회하는 함수
function getDept(pageNum){
    $.ajax({
        url : "http://localhost:8080/api/v1/dept?page="+pageNum,//백엔드 경로
        type : 'GET', //HTTP 메소드
        datatype : 'Json', //프론트에서 백엔드 결과를 Json으로 받겠다.
        success : function(response){ //요청이 성공하면!
            //배열하고 for문은 친구!!
            //response 배열
            $('#deptData').empty();
            $('.pagination').empty();
            console.log(response);
            var html = '';
            for(var i=0; i<response.list.length;i++){
                html +='<tr onclick="getDeptByDeptno('+response.list[i].deptno+')"><th>'+response.list[i].deptno+'</th><th>'+response.list[i].dname+'</th><th>'+response.list[i].loc+'</th><th>'+response.list[i].empno+'</th></tr>';               

            }
            //사원목록에 사원 데이터 바인딩(==사원목록 html에 데이터보여주기)
            //tbody태그 id :deptData에 바인딩 하기             
            $('#deptData').append(html);//바인딩 작업                
            var paginationHtml = '';
            if(response.hasPreviousPage){
                paginationHtml += '<a onclick="getDept('+(pageNum-1)+')">Previous</a>';
            }

            for(var i=0; i<response.navigatepageNums.length;i++){
                var page = response.navigatepageNums[i];
                paginationHtml += '<a onclick="getDept('+page+')">'+page+'</a>'
            }
            if(response.hasNextPage){
                paginationHtml += '<a onclick="getDept('+(pageNum+1)+')">Next</a>';
            }
            $('.pagination').append(paginationHtml);//페이징 바인딩 작업!
        }
    });
}

//특정 부서 조회 함수
function getDeptByDeptno(deptno){
    console.log("클릭한 부서번호는?" + deptno);
    $.ajax({
        url: 'http://localhost:8080/api/v1/dept/deptno/'+deptno,
        type: 'GET',
        dataType : 'Json',
        success: function(response){
           console.log(response);
           $('.update-popup').css('display', 'block');
           $('#u_deptno').val(response.deptno);
           $('#u_dname').val(response.dname);
           $('#u_loc').val(response.loc);
        }
    });
}
//부서 정보 수정(== 추가)
function updateDept(){

    var deptno =$('#u_deptno').val();
    var dname =$('#u_dname').val();
    var loc =$('#u_loc').val();
  

    var jsonData = {
        "deptno" : deptno,
        "dname" : dname,
        "loc" : loc
    };
   console.log(jsonData);

    $.ajax({
        url: 'http://localhost:8080/api/v1/dept',
        type: 'PATCH',
        contentType: 'application/json',
        dataType : 'json',
        data : JSON.stringify(jsonData),
        success: function(response){
           if(response> 0){
            alert('수정 완료');
            location.reload(); //자바스크립트에서 재공해주는 새로 고침
           }
        }
    });
}

//부서 추가
function setDept(){

    var deptno = $('#i_deptno').val();
    var dname = $('#i_dname').val();
    var loc = $('#i_loc').val();
   

    //빈값 체크 로직 구현하기
    if(deptno == ''){
        alert('부서번호를 입력하세요.');
        $('#i_deptno').focus();
        return false;
    }
    if(dname == ''){
        alert('부서이름을 입력하세요.');
        $('#i_dname').focus();
        return false;
    }
    if(loc == ''){
        alert('근무지를 입력하세요');
        $('#i_loc').focus();
        return false;
    }
 
    var jsonData = {
        "deptno" : deptno,
        "dname" : dname,
        "loc" : loc
    };
   console.log(jsonData);

    $.ajax({
        url: 'http://localhost:8080/api/v1/dept',
        type: 'POST',
        contentType: 'application/json',
        dataType : 'json',
        data : JSON.stringify(jsonData),
        success: function(response){
           if(response> 0){
            alert("부서가 등록 되었습니다.");
            location.reload(); //자바스크립트에서 재공해주는 새로 고침
           }else{
            alert("이미 존재하는 부서번호 입니다.👀")
           }
        }
    });
}
//부서 삭제
//데이터는 곧 자산
//실제로 기업에서는 데이터를 삭제하지 않고, 삭제 여부 컬럼을 추가해서 
//탈퇴한 회원은 Y 현재 회원은 N으로 관리한다.

function fireDept(){
    var deptno = $('#u_deptno').val();
    var dname = $('#u_dname').val();       
    $.ajax({
        url : "http://localhost:8080/api/v2/dept/deptno/"+deptno,
        type : 'PATCH', //HTTP 메소드
        dataType : 'json',        
        success : function(response){ //요청이 성공하면!
           if (response>0){                   
                alert(dname+'부서 삭제');
                location.reload();//자바스크립트에서 제공해주는 새로고침                
           }//결과확인      
        }
    });    
}